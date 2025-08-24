// Validation utilities for lead management

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePhone = (phone) => {
  // Basic phone validation - accepts various formats
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-$$$$]/g, ""))
}

const validateLeadData = (data) => {
  const errors = []

  // Required fields
  const requiredFields = ["firstName", "lastName", "email", "phone", "company", "city", "state", "source"]
  requiredFields.forEach((field) => {
    if (!data[field] || data[field].toString().trim() === "") {
      errors.push(`${field} is required`)
    }
  })

  // Email validation
  if (data.email && !validateEmail(data.email)) {
    errors.push("Invalid email format")
  }

  // Phone validation
  if (data.phone && !validatePhone(data.phone)) {
    errors.push("Invalid phone format")
  }

  // Enum validations
  const validSources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
  if (data.source && !validSources.includes(data.source)) {
    errors.push("Invalid source value")
  }

  const validStatuses = ["new", "contacted", "qualified", "lost", "won"]
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push("Invalid status value")
  }

  // Score validation
  if (data.score !== undefined && (data.score < 0 || data.score > 100)) {
    errors.push("Score must be between 0 and 100")
  }

  // Lead value validation
  if (data.leadValue !== undefined && data.leadValue < 0) {
    errors.push("Lead value must be non-negative")
  }

  return errors
}

module.exports = {
  validateEmail,
  validatePhone,
  validateLeadData,
}
