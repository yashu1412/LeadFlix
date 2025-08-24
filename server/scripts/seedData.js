const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const Lead = require("../models/Lead")
require("dotenv").config()

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lead-management")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Lead.deleteMany({})
    console.log("Cleared existing data")

    // Create test user
    const hashedPassword = await bcrypt.hash("password123", 12)
    const testUser = new User({
      email: "test@example.com",
      password: hashedPassword,
      firstName: "Test",
      lastName: "User",
    })
    await testUser.save()
    console.log("Created test user: test@example.com / password123")

    // Sample data for leads
    const sources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"]
    const statuses = ["new", "contacted", "qualified", "lost", "won"]
    const companies = [
      "TechCorp",
      "InnovateLabs",
      "DataSystems",
      "CloudWorks",
      "DigitalSolutions",
      "SmartTech",
      "FutureSoft",
      "NextGen",
      "ProTech",
      "WebMasters",
    ]
    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
    ]
    const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "TX", "CA", "TX", "CA"]

    const firstNames = [
      "John",
      "Jane",
      "Michael",
      "Sarah",
      "David",
      "Emily",
      "Robert",
      "Jessica",
      "William",
      "Ashley",
      "James",
      "Amanda",
      "Christopher",
      "Stephanie",
      "Daniel",
      "Melissa",
      "Matthew",
      "Nicole",
      "Anthony",
      "Elizabeth",
      "Mark",
      "Helen",
      "Donald",
      "Cynthia",
      "Steven",
      "Kathleen",
      "Paul",
      "Amy",
      "Andrew",
      "Angela",
      "Joshua",
      "Brenda",
      "Kenneth",
      "Emma",
      "Kevin",
      "Olivia",
      "Brian",
      "Caitlin",
      "George",
      "Madison",
      "Edward",
      "Avery",
      "Ronald",
      "Sofia",
      "Timothy",
      "Grace",
      "Jason",
      "Hannah",
      "Jeffrey",
      "Victoria",
    ]

    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
      "Hernandez",
      "Lopez",
      "Gonzalez",
      "Wilson",
      "Anderson",
      "Thomas",
      "Taylor",
      "Moore",
      "Jackson",
      "Martin",
      "Lee",
      "Perez",
      "Thompson",
      "White",
      "Harris",
      "Sanchez",
      "Clark",
      "Ramirez",
      "Lewis",
      "Robinson",
      "Walker",
      "Young",
      "Allen",
      "King",
      "Wright",
      "Scott",
      "Torres",
      "Nguyen",
      "Hill",
      "Flores",
      "Green",
      "Adams",
      "Nelson",
      "Baker",
      "Hall",
      "Rivera",
      "Campbell",
      "Mitchell",
      "Carter",
      "Roberts",
    ]

    // Generate 150 leads
    const leads = []
    for (let i = 0; i < 150; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const cityIndex = Math.floor(Math.random() * cities.length)

      const lead = {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        company: companies[Math.floor(Math.random() * companies.length)],
        city: cities[cityIndex],
        state: states[cityIndex],
        source: sources[Math.floor(Math.random() * sources.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        score: Math.floor(Math.random() * 101),
        leadValue: Math.floor(Math.random() * 50000) + 1000,
        isQualified: Math.random() > 0.7,
        userId: testUser._id,
        lastActivityAt:
          Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)) : null,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
      }
      leads.push(lead)
    }

    await Lead.insertMany(leads)
    console.log(`Created ${leads.length} sample leads`)

    console.log("Seed data created successfully!")
    console.log("Test user credentials:")
    console.log("Email: test@example.com")
    console.log("Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Seed data error:", error)
    process.exit(1)
  }
}

seedData()
