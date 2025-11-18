const mongoose = require("mongoose")

const gameSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  totalQuestions: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  incorrectCount: { type: Number, default: 0 },
  averageAccuracy: { type: Number, default: 0 },
  totalScore: { type: Number, default: 0 },
  bestDexterityScore: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  notes: String
})

module.exports = mongoose.model("GameSession", gameSessionSchema)