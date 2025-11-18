const mongoose = require("mongoose")

const gameQuestionResponseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "GameSession", required: true },
  questionIndex: { type: Number, required: true },
  questionText: { type: String, required: true },
  correctAnswer: { type: Number, required: true },
  predictedAnswer: { type: Number, required: true },
  confidence: { type: Number, default: 0 },
  responseTimeMs: { type: Number, default: 0 },
  accuracy: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  capturedAt: { type: Date, default: Date.now }
})

// Index for efficient queries
gameQuestionResponseSchema.index({ userId: 1, gameId: 1 })
gameQuestionResponseSchema.index({ userId: 1, capturedAt: -1 })

module.exports = mongoose.model("GameQuestionResponse", gameQuestionResponseSchema)