const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const authRoutes = require("./routes/authRoutes")
const gameRoutes = require("./routes/gameRoutes")
const gestureRoutes = require("./routes/gestureRoutes")

dotenv.config()

const app = express()

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://localhost:8080'],
  credentials: true
}))
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/signplay"

// Check if MongoDB URI is valid
if (!MONGODB_URI || MONGODB_URI.includes("your url here") || MONGODB_URI.includes("paste it")) {
  console.log("⚠️  WARNING: MongoDB URI not configured properly!")
  console.log("⚠️  Please set MONGODB_URI in server/.env file")
  console.log("⚠️  See QUICK_SETUP_GUIDE.md for MongoDB Atlas setup instructions")
  console.log("⚠️  Using default: mongodb://localhost:27017/signplay (will fail if MongoDB not installed)")
}

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully")
    console.log(`📊 Database: ${mongoose.connection.name}`)
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message)
    console.error("💡 Solutions:")
    console.error("   1. Make sure MongoDB is running locally (mongod)")
    console.error("   2. Or set MONGODB_URI in server/.env with your MongoDB Atlas connection string")
    console.error("   3. Check your internet connection if using MongoDB Atlas")
  })

app.use("/api/auth", authRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/gesture", gestureRoutes)

app.get("/api/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState
  const dbStates = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting"
  }
  res.json({ 
    status: "Backend running",
    database: {
      status: dbStates[dbStatus] || "unknown",
      connected: dbStatus === 1,
      databaseName: mongoose.connection.name || "not connected"
    }
  })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
