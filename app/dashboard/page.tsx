"use client"

import { useAuth } from "@/components/context/AuthContext"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { motion } from "framer-motion"

interface GameStats {
  user: {
    totalGamesPlayed: number
    averageAccuracy: number
    dexterityScore: number
    name: string
    correctAnswers: number
    incorrectAnswers: number
  }
  recentGames: Array<{
    _id: string
    question: string
    correctAnswer: number
    predictedAnswer: number
    accuracy: number
    isCorrect: boolean
    timestamp: string
  }>
  trends: Array<{
    _id: string
    accuracy: number
    isCorrect: boolean
    timestamp: string
    question: string
  }>
}

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<GameStats | null>(null)
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      if (!token) {
        console.log("No token available")
        setLoading(false)
        return
      }

      try {
        console.log("Fetching stats from:", `${API_URL}/game/stats`)
        const response = await fetch(`${API_URL}/game/stats`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Stats data received:", data)
        console.log("User stats:", data.user)
        console.log("Recent games:", data.recentGames)
        console.log("Trends:", data.trends)
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch stats:", err)
        // Set default stats if fetch fails
        setStats({
          user: {
            totalGamesPlayed: 0,
            averageAccuracy: 0,
            dexterityScore: 0,
            name: user?.name || "User",
            correctAnswers: 0,
            incorrectAnswers: 0
          },
          recentGames: [],
          trends: []
        })
      } finally {
        setLoading(false)
      }
    }

    if (token && user) {
      fetchStats()
    } else if (!authLoading) {
      setLoading(false)
    }
  }, [user, token, authLoading, router, API_URL])

  if (authLoading || loading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#70B2B2' }}></div>
            <p className="text-2xl font-semibold" style={{ color: '#016B61' }}>Loading your progress...</p>
          </div>
        </div>
      </main>
    )
  }

  const userStats = stats?.user ?? {
    totalGamesPlayed: 0,
    averageAccuracy: 0,
    dexterityScore: 0,
    name: "",
    correctAnswers: 0,
    incorrectAnswers: 0
  }
  const recentGames = stats?.recentGames ?? []
  const trends = stats?.trends ?? []

  // Chart data for accuracy trends
  const accuracyTrendData = trends.length > 0 
    ? trends.map((game, idx) => ({
        name: `Q${idx + 1}`,
        accuracy: game.accuracy || 0,
        date: new Date(game.timestamp).toLocaleDateString(),
        time: new Date(game.timestamp).toLocaleTimeString()
      }))
    : [
        { name: 'No Data', accuracy: 0, date: 'N/A', time: 'N/A' }
      ]

  // Chart data for success rate
  const successRateData = trends.length > 0 
    ? trends.map((game, idx) => ({
        name: `Q${idx + 1}`,
        correct: game.isCorrect ? 100 : 0,
        incorrect: game.isCorrect ? 0 : 100,
        date: new Date(game.timestamp).toLocaleDateString()
      }))
    : [
        { name: 'No Data', correct: 0, incorrect: 0, date: 'N/A' }
      ]

  // Overall statistics for pie chart data
  const overallStats = [
    { name: 'Correct', value: userStats.correctAnswers, color: '#70B2B2' },
    { name: 'Learning', value: userStats.incorrectAnswers, color: '#9ECFD4' }
  ]

  return (
    <main className="min-h-screen pb-12">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black mb-6 gradient-text">
            Your Progress Dashboard 📊
          </h1>
          <motion.button
            onClick={() => window.location.reload()}
            className="btn-secondary text-sm px-6 py-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Refresh Data
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="card-gradient text-center"
            style={{ backgroundColor: '#016B61', color: '#E5E9C5' }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎮
            </motion.div>
            <p className="text-lg font-bold mb-2">Total Games</p>
            <motion.p
              className="text-4xl font-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              {userStats.totalGamesPlayed}
            </motion.p>
          </motion.div>

          <motion.div
            className="card-gradient text-center"
            style={{ backgroundColor: '#70B2B2', color: '#E5E9C5' }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎯
            </motion.div>
            <p className="text-lg font-bold mb-2">Accuracy</p>
            <motion.p
              className="text-4xl font-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              {userStats.averageAccuracy}%
            </motion.p>
          </motion.div>

          <motion.div
            className="card-gradient text-center"
            style={{ backgroundColor: '#9ECFD4', color: '#016B61' }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✅
            </motion.div>
            <p className="text-lg font-bold mb-2">Correct</p>
            <motion.p
              className="text-4xl font-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9, type: "spring" }}
            >
              {userStats.correctAnswers}
            </motion.p>
          </motion.div>

          <motion.div
            className="card-gradient text-center"
            style={{ backgroundColor: '#E5E9C5', color: '#016B61' }}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ x: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⭐
            </motion.div>
            <p className="text-lg font-bold mb-2">Dexterity</p>
            <motion.p
              className="text-4xl font-black"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, type: "spring" }}
            >
              {userStats.dexterityScore}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-2xl mb-6" style={{ color: '#016B61' }}>📈 Accuracy Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ECFD4" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#70B2B2" 
                  fontSize={12}
                  fontFamily="Montserrat"
                />
                <YAxis 
                  stroke="#70B2B2" 
                  fontSize={12}
                  fontFamily="Montserrat"
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #70B2B2',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(1, 107, 97, 0.1)',
                    fontFamily: 'Montserrat'
                  }}
                  labelStyle={{ color: '#016B61', fontWeight: 600 }}
                  formatter={(value, name) => [`${value}%`, 'Accuracy']}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#016B61" 
                  strokeWidth={3}
                  dot={{ fill: '#70B2B2', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#016B61' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-2xl mb-6" style={{ color: '#016B61' }}>📊 Success Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#9ECFD4" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#70B2B2" 
                  fontSize={12}
                  fontFamily="Montserrat"
                />
                <YAxis 
                  stroke="#70B2B2" 
                  fontSize={12}
                  fontFamily="Montserrat"
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #70B2B2',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(1, 107, 97, 0.1)',
                    fontFamily: 'Montserrat'
                  }}
                  labelStyle={{ color: '#016B61', fontWeight: 600 }}
                  formatter={(value, name) => [
                    name === 'correct' ? 'Correct' : 'Incorrect', 
                    (value as number) > 0 ? '✓' : '✗'
                  ]}
                />
                <Bar 
                  dataKey="correct" 
                  fill="#70B2B2" 
                  radius={[6, 6, 0, 0]}
                  name="correct"
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Performance Summary */}
        {userStats.totalGamesPlayed > 0 && (
          <motion.div
            className="card mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="font-bold text-3xl mb-6" style={{ color: '#016B61' }}>📈 Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#E5E9C5' }}>
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-2xl font-bold" style={{ color: '#016B61' }}>
                  {userStats.averageAccuracy >= 80 ? 'Excellent!' : 
                   userStats.averageAccuracy >= 60 ? 'Good Progress!' : 
                   'Keep Learning!'}
                </p>
                <p className="text-lg" style={{ color: '#70B2B2' }}>
                  {userStats.averageAccuracy}% Average Accuracy
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#9ECFD4' }}>
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-2xl font-bold" style={{ color: '#016B61' }}>
                  {userStats.correctAnswers} / {userStats.correctAnswers + userStats.incorrectAnswers}
                </p>
                <p className="text-lg" style={{ color: '#016B61' }}>
                  Correct Answers
                </p>
              </div>
              <div className="text-center p-6 rounded-2xl" style={{ backgroundColor: '#70B2B2', color: '#E5E9C5' }}>
                <div className="text-4xl mb-2">📚</div>
                <p className="text-2xl font-bold">
                  {userStats.incorrectAnswers}
                </p>
                <p className="text-lg">
                  Learning Opportunities
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Games */}
        <motion.div
          className="card mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-3xl" style={{ color: '#016B61' }}>🎯 Recent Games</h3>
            <motion.button
              onClick={() => window.location.reload()}
              className="btn-secondary text-sm px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Refresh
            </motion.button>
          </div>
          
          {recentGames.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '2px solid #70B2B2' }}>
                    <th className="text-left py-4 px-4 text-lg font-bold" style={{ color: '#016B61' }}>Question</th>
                    <th className="text-left py-4 px-4 text-lg font-bold" style={{ color: '#016B61' }}>Your Answer</th>
                    <th className="text-left py-4 px-4 text-lg font-bold" style={{ color: '#016B61' }}>Result</th>
                    <th className="text-left py-4 px-4 text-lg font-bold" style={{ color: '#016B61' }}>Accuracy</th>
                    <th className="text-left py-4 px-4 text-lg font-bold" style={{ color: '#016B61' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGames.slice(0, 10).map((game, idx) => (
                    <motion.tr
                      key={game._id}
                      className="transition-colors"
                      style={{ 
                        borderBottom: '1px solid #9ECFD4',
                        backgroundColor: 'transparent'
                      }}
                      whileHover={{ backgroundColor: '#E5E9C5' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="py-4 px-4 text-lg" style={{ color: '#70B2B2' }}>
                        {game.question}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold px-3 py-1 rounded-full" 
                              style={{ 
                                backgroundColor: game.isCorrect ? '#70B2B2' : '#9ECFD4',
                                color: game.isCorrect ? '#E5E9C5' : '#016B61'
                              }}>
                          {game.predictedAnswer}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <motion.span 
                          className="text-3xl font-bold inline-block"
                          style={{ color: game.isCorrect ? '#70B2B2' : '#9ECFD4' }}
                          animate={game.isCorrect ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          {game.isCorrect ? "✓" : "✗"}
                        </motion.span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold px-3 py-1 rounded-full"
                              style={{ 
                                backgroundColor: game.accuracy === 100 ? '#70B2B2' : '#9ECFD4',
                                color: game.accuracy === 100 ? '#E5E9C5' : '#016B61'
                              }}>
                          {game.accuracy}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-center" style={{ color: '#9ECFD4' }}>
                        <div>{new Date(game.timestamp).toLocaleDateString()}</div>
                        <div className="text-xs">{new Date(game.timestamp).toLocaleTimeString()}</div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h4 className="text-2xl font-bold mb-4" style={{ color: '#016B61' }}>No Games Played Yet</h4>
              <p className="text-lg mb-6" style={{ color: '#70B2B2' }}>
                Start playing to see your progress and statistics here!
              </p>
              <Link href="/game" className="btn-primary">
                🚀 Play Your First Game
              </Link>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-6 justify-center flex-wrap"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/gesture-guide" className="btn-secondary text-xl">
            📚 Learn Gestures
          </Link>
          <Link href="/game" className="btn-primary text-xl">
            🎮 Play Again
          </Link>
          <Link href="/gesture-test" className="btn-success text-xl">
            🤖 Test Recognition
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
