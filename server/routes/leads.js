const express = require("express");
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Enum validation constants
const VALID_SOURCES = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
const VALID_STATUSES = ["new", "contacted", "qualified", "lost", "won"];

// ------------------------
// Helper: Build filter query
// ------------------------
const buildFilterQuery = (filters, userId) => {
  const query = { userId };

  if (!filters) return query;

  // String filters
  ["email", "company", "city"].forEach((field) => {
    if (filters[field]) {
      const { equals, contains } = filters[field];
      if (equals) query[field] = equals;
      if (contains) query[field] = { $regex: contains, $options: "i" };
    }
  });

  // Enum filters
  ["status", "source"].forEach((field) => {
    if (filters[field]) {
      const { equals, in: inArr } = filters[field];
      if (equals) query[field] = equals;
      if (Array.isArray(inArr)) query[field] = { $in: inArr };
    }
  });

  // Number filters
  ["score", "leadValue"].forEach((field) => {
    if (filters[field]) {
      const { equals, gt, lt, between } = filters[field];
      if (equals !== undefined) query[field] = equals;
      else {
        const conditions = {};
        if (gt !== undefined) conditions.$gt = gt;
        if (lt !== undefined) conditions.$lt = lt;
        if (Array.isArray(between) && between.length === 2) {
          conditions.$gte = between[0];
          conditions.$lte = between[1];
        }
        if (Object.keys(conditions).length) query[field] = conditions;
      }
    }
  });

  // Date filters
  ["createdAt", "lastActivityAt"].forEach((field) => {
    if (filters[field]) {
      const { on, before, after, between } = filters[field];
      const conditions = {};

      if (on) {
        const date = new Date(on);
        if (!isNaN(date)) {
          const nextDay = new Date(date);
          nextDay.setDate(date.getDate() + 1);
          query[field] = { $gte: date, $lt: nextDay };
        }
      } else {
        if (before && !isNaN(new Date(before))) conditions.$lt = new Date(before);
        if (after && !isNaN(new Date(after))) conditions.$gt = new Date(after);
        if (Array.isArray(between) && between.length === 2) {
          const [start, end] = between.map((d) => new Date(d));
          if (!isNaN(start) && !isNaN(end)) {
            conditions.$gte = start;
            conditions.$lte = end;
          }
        }
        if (Object.keys(conditions).length) query[field] = conditions;
      }
    }
  });

  // Boolean filters
  if (filters.isQualified && filters.isQualified.equals !== undefined) {
    query.isQualified = filters.isQualified.equals === true || filters.isQualified.equals === "true";
  }

  return query;
};

// ------------------------
// GET /leads (list with filters + pagination)
// ------------------------
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    let filters = {};
    if (req.query.filters) {
      try {
        filters = JSON.parse(req.query.filters);
      } catch {
        return res.status(400).json({ message: "Invalid filters format (must be JSON)" });
      }
    }

    const query = buildFilterQuery(filters, req.user._id);
    const total = await Lead.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ data: leads, page, limit, total, totalPages });
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Server error while fetching leads" });
  }
});

// ------------------------
// GET /leads/:id (single)
// ------------------------
router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, userId: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (error) {
    console.error("Get lead error:", error);
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid lead ID" });
    res.status(500).json({ message: "Server error while fetching lead" });
  }
});

// ------------------------
// POST /leads (create)
// ------------------------
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
    } = req.body;

    const requiredFields = ["firstName", "lastName", "email", "phone", "company", "city", "state", "source"];
    const missing = requiredFields.filter((f) => !req.body[f]);
    if (missing.length) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    if (!VALID_SOURCES.includes(source)) {
      return res.status(400).json({ message: "Invalid source value" });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be between 0 and 100" });
    }
    if (leadValue < 0) {
      return res.status(400).json({ message: "Lead value must be non-negative" });
    }

    const existingLead = await Lead.findOne({ email: email.toLowerCase(), userId: req.user._id });
    if (existingLead) {
      return res.status(400).json({ message: "Lead with this email already exists" });
    }

    const lead = new Lead({
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
      ...(lastActivityAt && { lastActivityAt: new Date(lastActivityAt) }),
    });

    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    if (error.code === 11000) return res.status(400).json({ message: "Lead with this email already exists" });
    res.status(500).json({ message: "Server error while creating lead" });
  }
});

// ------------------------
// PUT /leads/:id (update)
// ------------------------
router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, userId: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    const { source, status, score, leadValue, email } = req.body;

    if (source && !VALID_SOURCES.includes(source)) {
      return res.status(400).json({ message: "Invalid source value" });
    }
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (score !== undefined && (score < 0 || score > 100)) {
      return res.status(400).json({ message: "Score must be between 0 and 100" });
    }
    if (leadValue !== undefined && leadValue < 0) {
      return res.status(400).json({ message: "Lead value must be non-negative" });
    }

    if (email && email.toLowerCase() !== lead.email) {
      const existing = await Lead.findOne({ email: email.toLowerCase(), userId: req.user._id, _id: { $ne: lead._id } });
      if (existing) return res.status(400).json({ message: "Lead with this email already exists" });
    }

    Object.assign(lead, {
      ...req.body,
      ...(email && { email: email.toLowerCase() }),
      ...(req.body.lastActivityAt !== undefined && { lastActivityAt: req.body.lastActivityAt ? new Date(req.body.lastActivityAt) : null }),
    });

    await lead.save();
    res.status(200).json(lead);
  } catch (error) {
    console.error("Update lead error:", error);
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid lead ID" });
    if (error.code === 11000) return res.status(400).json({ message: "Lead with this email already exists" });
    res.status(500).json({ message: "Server error while updating lead" });
  }
});

// ------------------------
// DELETE /leads/:id
// ------------------------
router.delete("/:id", async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    if (error.name === "CastError") return res.status(400).json({ message: "Invalid lead ID" });
    res.status(500).json({ message: "Server error while deleting lead" });
  }
});

module.exports = router;
