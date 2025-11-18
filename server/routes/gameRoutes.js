const express = require("express")
const authMiddleware = require("../middleware/authMiddleware")
const User = require("../models/User")
const GameHistory = require("../models/GameHistory")
const GameSession = require("../models/GameSession")
const GameQuestionResponse = require("../models/GameQuestionResponse")

const router = express.Router()

// Create a new game session
router.post("/start-session", authMiddleware, async (req, res) => {
  try {
    console.log("🎮 Start session called for user:", req.userId)
    
    const gameSession = new GameSession({
      userId: req.userId,
      startedAt: new Date()
    })

    await gameSession.save()
    console.log("✅ Game session created:", gameSession._id)
    res.json({ success: true, gameId: gameSession._id })
  } catch (err) {
    console.error("❌ Start session error:", err)
    res.status(500).json({ error: err.message })
  }
})

// Save individual question response
router.post("/save-question", authMiddleware, async (req, res) => {
  try {
    console.log("📝 Save question called for user:", req.userId)
    console.log("📊 Question data:", req.body)
    
    const { gameId, questionIndex, questionText, correctAnswer, predictedAnswer, accuracy, confidence, responseTimeMs } = req.body

    const questionResponse = new GameQuestionResponse({
      userId: req.userId,
      gameId,
      questionIndex,
      questionText,
      correctAnswer,
      predictedAnswer,
      confidence: confidence || 0,
      responseTimeMs: responseTimeMs || 0,
      accuracy,
      isCorrect: correctAnswer === predictedAnswer
    })

    await questionResponse.save()
    console.log("✅ Question response saved")
    res.json({ success: true, questionResponse })
  } catch (err) {
    console.error("❌ Save question error:", err)
    res.status(500).json({ error: err.message })
  }
})

// Complete game session
router.post("/complete-session", authMiddleware, async (req, res) => {
  try {
    const { gameId } = req.body

    // Get all question responses for this session
    const questionResponses = await GameQuestionResponse.find({ gameId, userId: req.userId })
    
    const totalQuestions = questionResponses.length
    const correctCount = questionResponses.filter(q => q.isCorrect).length
    const incorrectCount = totalQuestions - correctCount
    const averageAccuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
    const totalScore = correctCount * 10
    const bestDexterityScore = Math.min(100, 70 + (averageAccuracy * 0.3))

    // Update the game session
    await GameSession.findByIdAndUpdate(gameId, {
      endedAt: new Date(),
      totalQuestions,
      correctCount,
      incorrectCount,
      averageAccuracy,
      totalScore,
      bestDexterityScore,
      isCompleted: true
    })

    // Update user statistics
    const user = await User.findById(req.userId)
    const allSessions = await GameSession.find({ userId: req.userId, isCompleted: true })
    
    user.totalGamesPlayed = allSessions.length
    const totalCorrect = allSessions.reduce((sum, session) => sum + session.correctCount, 0)
    const totalQuestionsAll = allSessions.reduce((sum, session) => sum + session.totalQuestions, 0)
    user.averageAccuracy = totalQuestionsAll > 0 ? Math.round((totalCorrect / totalQuestionsAll) * 100) : 0
    user.dexterityScore = Math.max(...allSessions.map(session => session.bestDexterityScore || 0))

    await user.save()

    res.json({ 
      success: true, 
      sessionStats: {
        totalQuestions,
        correctCount,
        incorrectCount,
        averageAccuracy,
        totalScore
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Legacy endpoint for backward compatibility
router.post("/save-result", authMiddleware, async (req, res) => {
  try {
    console.log("🎮 Save result called for user:", req.userId)
    console.log("📊 Request body:", req.body)
    
    const { question, correctAnswer, predictedAnswer, accuracy, speed, dexterityScore } = req.body

    const gameRecord = new GameHistory({
      userId: req.userId,
      question,
      correctAnswer,
      predictedAnswer,
      accuracy,
      speed,
      dexterityScore,
      isCorrect: correctAnswer === predictedAnswer,
    })

    console.log("💾 Saving game record:", gameRecord)
    await gameRecord.save()
    console.log("✅ Game record saved successfully")

    const user = await User.findById(req.userId)
    if (user) {
      user.totalGamesPlayed += 1

      const allGames = await GameHistory.find({ userId: req.userId })
      const avgAccuracy = allGames.reduce((sum, g) => sum + g.accuracy, 0) / allGames.length
      user.averageAccuracy = Math.round(avgAccuracy)
      user.dexterityScore = Math.max(...allGames.map((g) => g.dexterityScore || 0))

      await user.save()
      console.log("✅ User stats updated")
    }

    res.json({ success: true, gameRecord })
  } catch (err) {
    console.error("❌ Save result error:", err)
    res.status(500).json({ error: err.message })
  }
})

router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    
    // Get data from new session-based system
    const recentSessions = await GameSession.find({ userId: req.userId, isCompleted: true })
      .sort({ endedAt: -1 })
      .limit(10)
    
    const recentQuestions = await GameQuestionResponse.find({ userId: req.userId })
      .sort({ capturedAt: -1 })
      .limit(20)
    
    const totalSessions = await GameSession.countDocuments({ userId: req.userId, isCompleted: true })
    const totalQuestionsAnswered = await GameQuestionResponse.countDocuments({ userId: req.userId })
    const correctAnswersNew = await GameQuestionResponse.countDocuments({ userId: req.userId, isCorrect: true })
    
    // Get data from legacy system as fallback
    const legacyGames = await GameHistory.find({ userId: req.userId }).sort({ timestamp: -1 }).limit(20)
    const totalLegacyGames = await GameHistory.countDocuments({ userId: req.userId })
    const correctLegacyAnswers = await GameHistory.countDocuments({ userId: req.userId, isCorrect: true })
    
    // Combine data from both systems
    const totalGamesPlayed = totalSessions + Math.floor(totalLegacyGames / 10) // Estimate sessions from legacy data
    const totalCorrectAnswers = correctAnswersNew + correctLegacyAnswers
    const totalAnswers = totalQuestionsAnswered + totalLegacyGames
    const accuracyRate = totalAnswers > 0 ? Math.round((totalCorrectAnswers / totalAnswers) * 100) : 0
    
    // Combine recent games from both systems
    const combinedRecentGames = [
      ...recentSessions.map(session => ({
        _id: session._id,
        question: `Game Session - ${session.totalQuestions} questions`,
        correctAnswer: session.correctCount,
        predictedAnswer: session.correctCount,
        accuracy: session.averageAccuracy,
        isCorrect: session.averageAccuracy >= 70,
        timestamp: session.endedAt || session.startedAt
      })),
      ...legacyGames.slice(0, 10 - recentSessions.length).map(game => ({
        _id: game._id,
        question: game.question,
        correctAnswer: game.correctAnswer,
        predictedAnswer: game.predictedAnswer,
        accuracy: game.accuracy,
        isCorrect: game.isCorrect,
        timestamp: game.timestamp
      }))
    ].slice(0, 10)
    
    // Get trends data (prioritize new system, fallback to legacy)
    let trendData = []
    if (recentQuestions.length > 0) {
      trendData = recentQuestions.slice(0, 10).reverse().map((q, index) => ({
        _id: q._id,
        accuracy: q.accuracy,
        isCorrect: q.isCorrect,
        timestamp: q.capturedAt,
        question: q.questionText
      }))
    } else {
      trendData = legacyGames.slice(0, 10).reverse().map((game, index) => ({
        _id: game._id,
        accuracy: game.accuracy,
        isCorrect: game.isCorrect,
        timestamp: game.timestamp,
        question: game.question
      }))
    }
    
    res.json({
      user: {
        ...user.toObject(),
        totalGamesPlayed: Math.max(totalGamesPlayed, user.totalGamesPlayed || 0),
        averageAccuracy: Math.max(accuracyRate, user.averageAccuracy || 0),
        correctAnswers: totalCorrectAnswers,
        incorrectAnswers: totalAnswers - totalCorrectAnswers,
        dexterityScore: user.dexterityScore || 0
      },
      recentGames: combinedRecentGames,
      recentQuestions: recentQuestions,
      trends: trendData
    })
  } catch (err) {
    console.error("Stats endpoint error:", err)
    res.status(500).json({ error: err.message })
  }
})

// Test endpoint to check authentication
router.get("/test-auth", authMiddleware, async (req, res) => {
  try {
    console.log("🧪 Test auth endpoint called for user:", req.userId)
    const user = await User.findById(req.userId)
    res.json({ 
      success: true, 
      userId: req.userId,
      user: user ? { id: user._id, name: user.name, email: user.email } : null,
      message: "Authentication working!"
    })
  } catch (err) {
    console.error("❌ Test auth error:", err)
    res.status(500).json({ error: err.message })
  }
})

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const gameHistory = await GameHistory.find({ userId: req.userId }).sort({ timestamp: -1 })
    res.json(gameHistory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
