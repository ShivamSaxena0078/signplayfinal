const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

const authMiddleware = (req, res, next) => {
  console.log("🔐 Auth middleware called for:", req.method, req.path)
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    console.log("❌ No token provided")
    return res.status(401).json({ error: "No token provided" })
  }

  try {
    console.log("🔑 Using JWT_SECRET:", JWT_SECRET.substring(0, 10) + "...")
    const decoded = jwt.verify(token, JWT_SECRET)
    req.userId = decoded.userId
    console.log("✅ Token valid for user:", req.userId)
    next()
  } catch (err) {
    console.log("❌ Invalid token:", err.message)
    console.log("🔑 Token being verified with secret:", JWT_SECRET.substring(0, 10) + "...")
    res.status(401).json({ error: "Invalid token" })
  }
}

module.exports = authMiddleware
