"use client"

import { useAuth } from "@/components/context/AuthContext"
import Navbar from "@/components/Navbar"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"

interface GameQuestion {
  num1: number
  num2: number
  operator: string
  correctAnswer: number
}

const generateQuestion = (): GameQuestion => {
  const operators = ["+", "-", "*", "/"]

  while (true) {
    const operator = operators[Math.floor(Math.random() * operators.length)]
    const num1 = Math.floor(Math.random() * 10)
    let num2 = Math.floor(Math.random() * 10)

    if (operator === "/" && num2 === 0) num2 = 1

    let correctAnswer = 0

    if (operator === "+") correctAnswer = num1 + num2
    else if (operator === "-") correctAnswer = num1 - num2
    else if (operator === "*") correctAnswer = num1 * num2
    else if (operator === "/") correctAnswer = Math.floor(num1 / num2)

    if (correctAnswer >= 0 && correctAnswer <= 9) {
      return { num1, num2, operator, correctAnswer }
    }
  }
}


export default function GamePage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [question, setQuestion] = useState<GameQuestion | null>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [predictedAnswer, setPredictedAnswer] = useState("")
  const [feedback, setFeedback] = useState("")
  const [showingFeedback, setShowingFeedback] = useState(false)
  const [gameStats, setGameStats] = useState({
    correct: 0,
    incorrect: 0,
    score: 0,
  })
  const [questionCount, setQuestionCount] = useState(0)
  const [gameEnded, setGameEnded] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)
  const [finalResults, setFinalResults] = useState<{
    totalQuestions: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    score: number;
    comment: string;
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const [webcamActive, setWebcamActive] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  // Motivational messages
  const correctMessages = [
    "🎉 Amazing! You're a sign language superstar!",
    "✨ Perfect! Your gestures are getting better!",
    "🚀 Incredible! Keep up the fantastic work!",
    "🌟 Outstanding! You're mastering this!",
    "💫 Brilliant! Your skills are improving!",
    "🎯 Excellent! Right on target!",
    "🏆 Fantastic! You're becoming a pro!",
    "⭐ Wonderful! Your dedication shows!"
  ]

  const encouragementMessages = [
    "💪 Don't give up! You're learning and growing!",
    "🌈 Every mistake is a step toward success!",
    "🎯 Close one! Try again, you've got this!",
    "✨ Keep practicing! You're improving with each try!",
    "🚀 Learning is a journey! You're doing great!",
    "💡 Great effort! Let's try that gesture again!",
    "🌟 You're getting better! Practice makes perfect!",
    "🎮 No worries! Every expert was once a beginner!"
  ]

  // Confetti functions
  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#016B61', '#70B2B2', '#9ECFD4', '#E5E9C5']
    })
    
    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#70B2B2', '#9ECFD4']
      })
    }, 200)
    
    // Third burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#016B61', '#E5E9C5']
      })
    }, 400)
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const startGame = async () => {
    console.log("🎮 Starting game...")
    console.log("🔐 Token available:", !!token)
    console.log("👤 User:", user?.name)
    
    try {
      // Create a new game session
      console.log("📡 Calling start-session API...")
      const response = await fetch(`${API_URL}/game/start-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("📡 Start-session response status:", response.status)
      
      if (response.ok) {
        const data = await response.json()
        setGameId(data.gameId)
        console.log("✅ Game session started:", data.gameId)
      } else {
        const errorData = await response.json()
        console.error("❌ Start-session failed:", errorData)
      }
    } catch (err) {
      console.error("❌ Failed to start game session:", err)
    }

    const newQuestion = generateQuestion()
    setQuestion(newQuestion)
    setGameStarted(true)
    setGameEnded(false)
    setPredictedAnswer("")
    setFeedback("")
    setShowingFeedback(false)
    setWebcamActive(true)
    setQuestionCount(1)
    setGameStats({ correct: 0, incorrect: 0, score: 0 })
    setFinalResults(null)
    setQuestionStartTime(Date.now())
  }

  const captureFrame = async () => {
    setLoading(true)
    try {
      // Get the video element directly from DOM
      const video = document.querySelector("video") as HTMLVideoElement
      
      if (!video) {
        console.error("❌ No video element found")
        setFeedback("Webcam not ready. Please wait a moment.")
        return
      }

      // Check if video is actually playing
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        console.error("❌ Video not ready yet")
        setFeedback("Webcam is loading. Please try again.")
        return
      }

      // Create canvas and capture frame
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        console.error("❌ Failed to get canvas context")
        setFeedback("Canvas error. Please refresh the page.")
        return
      }

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to Base64 PNG
      const imageSrc = canvas.toDataURL("image/png")

      // Validate image
      if (!imageSrc || imageSrc.length < 50) {
        console.error("❌ Canvas produced empty image")
        setFeedback("Failed to capture image. Please try again.")
        return
      }

      console.log("📸 Captured image successfully, size:", imageSrc.length, "bytes")
      console.log("📐 Canvas dimensions:", canvas.width, "x", canvas.height)

      // Send frame to gesture recognition service
      const response = await fetch("/api/gesture/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageSrc }),
      })

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}))
        throw new Error(errorBody.error || "Prediction request failed")
      }

      const data = await response.json()
      console.log("🔮 Prediction response:", data)
      
      if (data.error === "no_hand_detected") {
        setFeedback("No hand detected. Please show your hand clearly to the camera.")
        return
      }
      
      const predictedDigit = data.prediction ?? 0

      // Set the answer directly (not concatenating)
      setPredictedAnswer(String(predictedDigit))
      setFeedback(`Detected gesture: ${predictedDigit}`)
    } catch (err) {
      console.error("❌ Prediction error:", err)
      setFeedback("Prediction service unavailable. Ensure the Flask server is running and try again.")
    } finally {
      setLoading(false)
    }
  }

  const checkAnswer = async () => {
    if (!question) return

    const isCorrect = Number.parseInt(predictedAnswer) === question.correctAnswer
    setShowingFeedback(true)
    
    if (isCorrect) {
      // Trigger confetti and success animations
      triggerSuccessConfetti()
      const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)]
      setFeedback(randomMessage)
      
      // Success toast
      toast.success(`Correct! The answer is ${question.correctAnswer}`, {
        icon: '🎉',
        style: {
          borderRadius: '20px',
          background: '#70B2B2',
          color: '#E5E9C5',
          fontWeight: '600',
          fontFamily: 'Montserrat'
        },
      })
    } else {
      const randomEncouragement = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
      setFeedback(randomEncouragement)
      
      // Encouragement toast
      toast.error(`Incorrect! Correct answer: ${question.correctAnswer}`, {
        icon: '💪',
        style: {
          borderRadius: '20px',
          background: '#9ECFD4',
          color: '#016B61',
          fontWeight: '600',
          fontFamily: 'Montserrat'
        },
      })
    }

    // Update game stats and get the new values
    const newStats = {
      correct: isCorrect ? gameStats.correct + 1 : gameStats.correct,
      incorrect: isCorrect ? gameStats.incorrect : gameStats.incorrect + 1,
      score: isCorrect ? gameStats.score + 10 : gameStats.score,
    }
    
    setGameStats(newStats)

    // Save question response to backend (try new system first, fallback to legacy)
    if (token) {
      console.log(`💾 Saving question ${questionCount}...`)
      console.log("🔐 Token:", token ? "Available" : "Missing")
      console.log("🎮 GameId:", gameId || "Not set")
      
      try {
        if (gameId) {
          // Try new session-based system
          console.log("📡 Calling save-question API...")
          const responseTime = Date.now() - questionStartTime
          const response = await fetch(`${API_URL}/game/save-question`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              gameId: gameId,
              questionIndex: questionCount,
              questionText: `${question.num1} ${question.operator} ${question.num2}`,
              correctAnswer: question.correctAnswer,
              predictedAnswer: Number.parseInt(predictedAnswer),
              accuracy: isCorrect ? 100 : 0,
              confidence: 85,
              responseTimeMs: responseTime,
            }),
          })
          
          console.log("📡 Save-question response status:", response.status)
          if (response.ok) {
            console.log(`✅ Question ${questionCount} saved to new system`)
          } else {
            const errorData = await response.json()
            console.error("❌ Save-question failed:", errorData)
            throw new Error("New system failed")
          }
        } else {
          // Fallback to legacy system
          console.log("📡 Calling legacy save-result API...")
          const response = await fetch(`${API_URL}/game/save-result`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question: `${question.num1} ${question.operator} ${question.num2}`,
              correctAnswer: question.correctAnswer,
              predictedAnswer: Number.parseInt(predictedAnswer),
              accuracy: isCorrect ? 100 : 0,
              speed: 0,
              dexterityScore: 85,
            }),
          })
          
          console.log("📡 Save-result response status:", response.status)
          if (response.ok) {
            console.log(`✅ Question ${questionCount} saved to legacy system`)
          } else {
            const errorData = await response.json()
            console.error("❌ Save-result failed:", errorData)
            throw new Error("Legacy system failed")
          }
        }
      } catch (err) {
        console.error("❌ Primary save failed:", err)
        // Try legacy system as final fallback
        try {
          console.log("📡 Trying final fallback to legacy system...")
          const response = await fetch(`${API_URL}/game/save-result`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question: `${question.num1} ${question.operator} ${question.num2}`,
              correctAnswer: question.correctAnswer,
              predictedAnswer: Number.parseInt(predictedAnswer),
              accuracy: isCorrect ? 100 : 0,
              speed: 0,
              dexterityScore: 85,
            }),
          })
          
          console.log("📡 Fallback response status:", response.status)
          if (response.ok) {
            console.log(`✅ Question ${questionCount} saved to legacy fallback`)
          } else {
            const errorData = await response.json()
            console.error("❌ Final fallback failed:", errorData)
          }
        } catch (fallbackErr) {
          console.error("❌ All save attempts failed:", fallbackErr)
        }
      }
    } else {
      console.error("❌ No token available for saving!")
    }

    // Auto-progress to next question after 3 seconds
    setTimeout(() => {
      if (questionCount >= 10) {
        endGame(newStats)
      } else {
        nextQuestion()
      }
    }, 3000)
  }

  const nextQuestion = () => {
    if (questionCount >= 10) {
      endGame(gameStats)
      return
    }
    
    const newQuestion = generateQuestion()
    setQuestion(newQuestion)
    setPredictedAnswer("")
    setFeedback("")
    setShowingFeedback(false)
    setWebcamActive(true)
    setQuestionCount(prev => prev + 1)
    setQuestionStartTime(Date.now())
  }

  const endGame = async (finalStats?: { correct: number; incorrect: number; score: number }) => {
    setGameEnded(true)
    setWebcamActive(false)
    
    // Use provided stats or current gameStats
    const stats = finalStats || gameStats
    const totalAnswered = stats.correct + stats.incorrect
    const accuracy = totalAnswered > 0 
      ? Math.round((stats.correct / totalAnswered) * 100)
      : 0
    
    let comment = ""
    if (accuracy >= 90) comment = "🏆 Outstanding! You're a sign language master!"
    else if (accuracy >= 80) comment = "🌟 Excellent work! You're getting really good at this!"
    else if (accuracy >= 70) comment = "👏 Great job! Keep practicing to improve even more!"
    else if (accuracy >= 60) comment = "💪 Good effort! You're learning and improving!"
    else comment = "🌱 Keep practicing! Every expert was once a beginner!"
    
    console.log("🎯 Final game stats:", {
      totalQuestions: questionCount,
      correct: stats.correct,
      incorrect: stats.incorrect,
      accuracy,
      score: stats.score
    })
    
    setFinalResults({
      totalQuestions: questionCount,
      correct: stats.correct,
      incorrect: stats.incorrect,
      accuracy,
      score: stats.score,
      comment
    })

    // Complete the game session (try new system first, fallback to legacy)
    if (token) {
      try {
        if (gameId) {
          // Try new session-based system
          const response = await fetch(`${API_URL}/game/complete-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              gameId: gameId,
            }),
          })
          
          if (response.ok) {
            const data = await response.json()
            console.log("✅ Game session completed successfully:", data.sessionStats)
          }
        } else {
          // Fallback to legacy system
          await fetch(`${API_URL}/game/save-result`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question: `Game Summary - ${questionCount} questions`,
              correctAnswer: gameStats.correct,
              predictedAnswer: gameStats.correct,
              accuracy: accuracy,
              speed: 0,
              dexterityScore: Math.min(100, 70 + (accuracy * 0.3)),
            }),
          })
          console.log("✅ Final game results saved to legacy system")
        }
      } catch (err) {
        console.error("❌ Failed to complete game session:", err)
        // Try legacy system as final fallback
        try {
          await fetch(`${API_URL}/game/save-result`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              question: `Game Summary - ${questionCount} questions`,
              correctAnswer: gameStats.correct,
              predictedAnswer: gameStats.correct,
              accuracy: accuracy,
              speed: 0,
              dexterityScore: Math.min(100, 70 + (accuracy * 0.3)),
            }),
          })
          console.log("✅ Final game results saved to legacy fallback")
        } catch (fallbackErr) {
          console.error("Failed to save to legacy system:", fallbackErr)
        }
      }
    }
  }

  if (authLoading) {
    return (
      <main className="bg-background min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pb-12">
      <Navbar />
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          className="text-6xl font-black text-center mb-12 gradient-text"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Math Quest 🎯
        </motion.h1>

        <AnimatePresence mode="wait">
          {gameEnded ? (
            <motion.div
              key="end-screen"
              className="card glass-card text-center py-16 max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-8xl mb-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎉
              </motion.div>
              <h2 className="text-5xl font-bold mb-6" style={{ color: '#016B61' }}>Quiz Complete!</h2>
              <p className="text-2xl mb-8" style={{ color: '#70B2B2' }}>{finalResults?.comment}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="card-gradient text-center" style={{ backgroundColor: '#016B61', color: '#E5E9C5' }}>
                  <p className="text-lg font-bold mb-2">Questions</p>
                  <p className="text-4xl font-black">{finalResults?.totalQuestions}</p>
                </div>
                <div className="card-gradient text-center" style={{ backgroundColor: '#70B2B2', color: '#E5E9C5' }}>
                  <p className="text-lg font-bold mb-2">Correct</p>
                  <p className="text-4xl font-black">{finalResults?.correct}</p>
                </div>
                <div className="card-gradient text-center" style={{ backgroundColor: '#9ECFD4', color: '#016B61' }}>
                  <p className="text-lg font-bold mb-2">Accuracy</p>
                  <p className="text-4xl font-black">{finalResults?.accuracy}%</p>
                </div>
                <div className="card-gradient text-center" style={{ backgroundColor: '#E5E9C5', color: '#016B61' }}>
                  <p className="text-lg font-bold mb-2">Score</p>
                  <p className="text-4xl font-black">{finalResults?.score}</p>
                </div>
              </div>
              
              <div className="flex gap-6 justify-center">
                <motion.button
                  onClick={startGame}
                  className="btn-primary text-2xl px-12 py-6"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔄 Play Again
                </motion.button>
                <motion.button
                  onClick={() => router.push('/dashboard')}
                  className="btn-secondary text-2xl px-12 py-6"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 View Dashboard
                </motion.button>
              </div>
            </motion.div>
          ) : !gameStarted ? (
            <motion.div
              key="start-screen"
              className="card glass-card text-center py-16 max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-8xl mb-8"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎮
              </motion.div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: '#016B61' }}>Ready to Play?</h2>
              <p className="text-xl mb-12 leading-relaxed" style={{ color: '#70B2B2' }}>
                Solve math problems by showing hand gestures to your camera!<br />
                <span className="text-2xl" style={{ color: '#016B61' }}>✨ Let's make learning fun! ✨</span>
              </p>
              <motion.button
                onClick={startGame}
                className="btn-primary text-2xl px-12 py-6"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Start Adventure
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="game-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Question Display */}
              <motion.div
                className="card-gradient mb-8 text-center pulse-glow"
                style={{ backgroundColor: '#016B61', color: '#E5E9C5' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl font-bold">🧮 Solve This!</p>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold">Question {questionCount}/10</p>
                    <motion.button
                      onClick={() => endGame(gameStats)}
                      className="btn-secondary text-sm px-4 py-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      End Quiz
                    </motion.button>
                  </div>
                </div>
                <motion.p
                  className="text-7xl font-black"
                  key={`${question?.num1}-${question?.operator}-${question?.num2}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  {question?.num1} {question?.operator} {question?.num2} = ?
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Webcam */}
                <motion.div
                  className="card bg-black rounded-3xl overflow-hidden"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {webcamActive && (
                    <Webcam
                      ref={webcamRef}
                      mirrored={true}
                      className="w-full rounded-3xl"
                      videoConstraints={{ width: 640, height: 480 }}
                    />
                  )}
                  {!webcamActive && (
                    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl">
                      <div className="text-center">
                        <div className="text-6xl mb-4">📷</div>
                        <p className="text-xl">Camera ready for next question!</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Answer Input */}
                <motion.div
                  className="card"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="mb-8">
                    <label className="block text-2xl font-bold mb-4" style={{ color: '#016B61' }}>Your Answer</label>
                    <motion.input
                      type="text"
                      value={predictedAnswer}
                      readOnly
                      className="w-full px-6 py-4 text-4xl font-black border-4 rounded-2xl text-center transition-all duration-300"
                      style={{
                        borderColor: predictedAnswer ? '#70B2B2' : '#9ECFD4',
                        backgroundColor: predictedAnswer ? '#E5E9C5' : '#FFFFFF',
                        color: predictedAnswer ? '#016B61' : '#70B2B2'
                      }}
                      placeholder="Show gesture..."
                      animate={predictedAnswer ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {feedback && (
                    <motion.div
                      className={`text-xl font-bold mb-6 p-6 rounded-2xl text-center ${
                        feedback.includes('🎉') || feedback.includes('✨') || feedback.includes('🚀')
                          ? 'success-bounce'
                          : 'shake-animation'
                      }`}
                      style={{
                        backgroundColor: feedback.includes('🎉') || feedback.includes('✨') || feedback.includes('🚀')
                          ? '#E5E9C5'
                          : '#9ECFD4',
                        color: '#016B61'
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {feedback}
                      {showingFeedback && (
                        <div className="mt-3 text-sm" style={{ color: '#70B2B2' }}>
                          {questionCount >= 10 ? 'Finishing quiz...' : 'Next question in 3 seconds...'}
                        </div>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-4 flex-wrap justify-center">
                    {!predictedAnswer && !showingFeedback && (
                      <motion.button
                        onClick={captureFrame}
                        disabled={loading}
                        className="btn-success disabled:opacity-50 text-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loading ? "⏳ Processing..." : "📸 Capture Gesture"}
                      </motion.button>
                    )}

                    {predictedAnswer && !showingFeedback && (
                      <>
                        <motion.button
                          onClick={checkAnswer}
                          className="btn-primary text-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          ✓ Check Answer
                        </motion.button>
                        <motion.button
                          onClick={captureFrame}
                          disabled={loading}
                          className="btn-secondary disabled:opacity-50 text-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          🔄 Try Again
                        </motion.button>
                      </>
                    )}

                    {showingFeedback && (
                      <div className="flex gap-4">
                        <motion.button
                          onClick={() => {
                            if (questionCount >= 10) {
                              endGame(gameStats)
                            } else {
                              nextQuestion()
                            }
                          }}
                          className="btn-success text-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                        >
                          {questionCount >= 10 ? "Finish Quiz Now" : "Skip to Next →"}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  className="card-gradient text-center"
                  style={{ backgroundColor: '#016B61', color: '#E5E9C5' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-bold mb-2">🎯 Correct</p>
                  <motion.p
                    className="text-5xl font-black"
                    key={gameStats.correct}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {gameStats.correct}
                  </motion.p>
                </motion.div>
                <motion.div
                  className="card-gradient text-center"
                  style={{ backgroundColor: '#70B2B2', color: '#E5E9C5' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-bold mb-2">💪 Learning</p>
                  <motion.p
                    className="text-5xl font-black"
                    key={gameStats.incorrect}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {gameStats.incorrect}
                  </motion.p>
                </motion.div>
                <motion.div
                  className="card-gradient text-center"
                  style={{ backgroundColor: '#9ECFD4', color: '#016B61' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-lg font-bold mb-2">⭐ Score</p>
                  <motion.p
                    className="text-5xl font-black"
                    key={gameStats.score}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {gameStats.score}
                  </motion.p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
