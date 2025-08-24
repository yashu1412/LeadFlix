const mongoose = require("mongoose")

const leadSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
      enum: ["website", "facebook_ads", "google_ads", "referral", "events", "other"],
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "contacted", "qualified", "lost", "won"],
      default: "new",
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    leadValue: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lastActivityAt: {
      type: Date,
      default: null,
    },
    isQualified: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
leadSchema.index({ userId: 1, email: 1 })
leadSchema.index({ userId: 1, status: 1 })
leadSchema.index({ userId: 1, source: 1 })
leadSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model("Lead", leadSchema)
