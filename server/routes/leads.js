const express = require("express")
const Lead = require("../models/Lead")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// Apply auth middleware to all routes
router.use(authMiddleware)

// Helper function to build MongoDB query from filters
const buildFilterQuery = (filters, userId) => {
  const query = { userId }

  if (!filters) return query

  // String field filters (email, company, city)
  const stringFields = ["email", "company", "city"]
  stringFields.forEach((field) => {
    if (filters[field]) {
      const filter = filters[field]
      if (filter.equals) {
        query[field] = filter.equals
      } else if (filter.contains) {
        query[field] = { $regex: filter.contains, $options: "i" }
      }
    }
  })

  // Enum field filters (status, source)
  const enumFields = ["status", "source"]
  enumFields.forEach((field) => {
    if (filters[field]) {
      const filter = filters[field]
      if (filter.equals) {
        query[field] = filter.equals
      } else if (filter.in && Array.isArray(filter.in)) {
        query[field] = { $in: filter.in }
      }
    }
  })

  // Number field filters (score, leadValue)
  const numberFields = ["score", "leadValue"]
  numberFields.forEach((field) => {
    if (filters[field]) {
      const filter = filters[field]
      if (filter.equals !== undefined) {
        query[field] = filter.equals
      } else {
        const conditions = {}
        if (filter.gt !== undefined) conditions.$gt = filter.gt
        if (filter.lt !== undefined) conditions.$lt = filter.lt
        if (filter.between && Array.isArray(filter.between) && filter.between.length === 2) {
          conditions.$gte = filter.between[0]
          conditions.$lte = filter.between[1]
        }
        if (Object.keys(conditions).length > 0) {
          query[field] = conditions
        }
      }
    }
  })

  // Date field filters (createdAt, lastActivityAt)
  const dateFields = [
    { filter: "createdAt", db: "createdAt" },
    { filter: "lastActivityAt", db: "lastActivityAt" },
  ]
  dateFields.forEach(({ filter: filterField, db: dbField }) => {
    if (filters[filterField]) {
      const filter = filters[filterField]
      if (filter.on) {
        const date = new Date(filter.on)
        const nextDay = new Date(date)
        nextDay.setDate(date.getDate() + 1)
        query[dbField] = { $gte: date, $lt: nextDay }
      } else {
        const conditions = {}
        if (filter.before) conditions.$lt = new Date(filter.before)
        if (filter.after) conditions.$gt = new Date(filter.after)
        if (filter.between && Array.isArray(filter.between) && filter.between.length === 2) {
          conditions.$gte = new Date(filter.between[0])
          conditions.$lte = new Date(filter.between[1])
        }
        if (Object.keys(conditions).length > 0) {
          query[dbField] = conditions
        }
      }
    }
  })

  // Boolean field filters (isQualified)
  if (filters.isQualified && filters.isQualified.equals !== undefined) {
    query.isQualified = filters.isQualified.equals
  }

  return query
}

// GET /leads - List leads with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit

    // Parse filters from query string
    let filters = {}
    if (req.query.filters) {
      try {
        filters = JSON.parse(req.query.filters)
      } catch (error) {
        return res.status(400).json({ message: "Invalid filters format" })
      }
    }

    // Build query
    const query = buildFilterQuery(filters, req.user._id)

    // Get total count for pagination
    const total = await Lead.countDocuments(query)
    const totalPages = Math.ceil(total / limit)

    // Get leads with pagination
    const leads = await Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

    res.status(200).json({
      data: leads,
      page,
      limit,
      total,
      totalPages,
    })
  } catch (error) {
    console.error("Get leads error:", error)
    res.status(500).json({ message: "Server error while fetching leads" })
  }
})

// GET /leads/:id - Get single lead
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    res.status(200).json(lead)
  } catch (error) {
    console.error("Get lead error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" })
    }
    res.status(500).json({ message: "Server error while fetching lead" })
  }
})

// POST /leads - Create new lead
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      city,
      state,
      source,
      status = "new",
      score = 0,
      leadValue = 0,
      lastActivityAt,
      isQualified = false,
    } = req.body

    // Validation
    const requiredFields = ["firstName", "lastName", "email", "phone", "company", "city", "state", "source"]
    const missingFields = requiredFields.filter((field) => !req.body[field])

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      })
    }

    // Validate enums
    const validSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
    const validStatuses = ["new", "contacted", "qualified", "lost", "won"]

    if (!validSources.includes(source)) {
      return res.status(400).json({ message: "Invalid source value" })
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" })
    }

    // Validate score range
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be between 0 and 100" })
    }

    // Validate leadValue
    if (leadValue < 0) {
      return res.status(400).json({ message: "Lead value must be non-negative" })
    }

    // Check for duplicate email
    const existingLead = await Lead.findOne({
      email: email.toLowerCase(),
      userId: req.user._id,
    })

    if (existingLead) {
      return res.status(400).json({ message: "Lead with this email already exists" })
    }

    // Create lead
    const leadData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      leadValue,
      isQualified,
      userId: req.user._id,
    }

    if (lastActivityAt) {
      leadData.lastActivityAt = new Date(lastActivityAt)
    }

    const lead = new Lead(leadData)
    await lead.save()

    res.status(201).json(lead)
  } catch (error) {
    console.error("Create lead error:", error)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Lead with this email already exists" })
    }
    res.status(500).json({ message: "Server error while creating lead" })
  }
})

// PUT /leads/:id - Update lead
router.put("/:id", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      city,
      state,
      source,
      status,
      score,
      leadValue,
      lastActivityAt,
      isQualified,
    } = req.body

    // Find lead
    const lead = await Lead.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    // Validate enums if provided
    if (source) {
      const validSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
      if (!validSources.includes(source)) {
        return res.status(400).json({ message: "Invalid source value" })
      }
    }

    if (status) {
      const validStatuses = ["new", "contacted", "qualified", "lost", "won"]
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status value" })
      }
    }

    // Validate score if provided
    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({ message: "Score must be between 0 and 100" })
    }

    // Validate leadValue if provided
    if (leadValue !== undefined && leadValue < 0) {
      return res.status(400).json({ message: "Lead value must be non-negative" })
    }

    // Check for duplicate email if email is being changed
    if (email && email.toLowerCase() !== lead.email) {
      const existingLead = await Lead.findOne({
        email: email.toLowerCase(),
        userId: req.user._id,
        _id: { $ne: lead._id },
      })

      if (existingLead) {
        return res.status(400).json({ message: "Lead with this email already exists" })
      }
    }

    // Update fields
    const updateData = {}
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (email !== undefined) updateData.email = email.toLowerCase()
    if (phone !== undefined) updateData.phone = phone
    if (company !== undefined) updateData.company = company
    if (city !== undefined) updateData.city = city
    if (state !== undefined) updateData.state = state
    if (source !== undefined) updateData.source = source
    if (status !== undefined) updateData.status = status
    if (score !== undefined) updateData.score = score
    if (leadValue !== undefined) updateData.leadValue = leadValue
    if (isQualified !== undefined) updateData.isQualified = isQualified
    if (lastActivityAt !== undefined) {
      updateData.lastActivityAt = lastActivityAt ? new Date(lastActivityAt) : null
    }

    const updatedLead = await Lead.findByIdAndUpdate(lead._id, updateData, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(updatedLead)
  } catch (error) {
    console.error("Update lead error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" })
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Lead with this email already exists" })
    }
    res.status(500).json({ message: "Server error while updating lead" })
  }
})

// DELETE /leads/:id - Delete lead
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" })
    }

    res.status(200).json({ message: "Lead deleted successfully" })
  } catch (error) {
    console.error("Delete lead error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid lead ID" })
    }
    res.status(500).json({ message: "Server error while deleting lead" })
  }
})

module.exports = router
