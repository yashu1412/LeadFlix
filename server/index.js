const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")

// Import routes
const authRoutes = require("./routes/auth")
const leadRoutes = require("./routes/leads")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://lead-flix-ea1i.vercel.app/", // Vite's default port
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://yashpalsinghpawara:70CBoFDoR3KqZSMI@cluster0.pfzz2zx.mongodb.net/Demoproject", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/leads", leadRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
