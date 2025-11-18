"use client"

import Link from "next/link"
import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 rounded-full"
            style={{ backgroundColor: '#9ECFD4', opacity: 0.3 }}
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-32 h-32 rounded-full"
            style={{ backgroundColor: '#70B2B2', opacity: 0.2 }}
            animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-24 h-24 rounded-full"
            style={{ backgroundColor: '#016B61', opacity: 0.1 }}
            animate={{ y: [0, -15, 0], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="text-center max-w-4xl z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black mb-6 gradient-text"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            SignPlay
          </motion.h1>
          
          <motion.p
            className="text-2xl md:text-3xl mb-12 font-light leading-relaxed"
            style={{ color: '#70B2B2' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Master sign language numbers through
            <span className="font-bold" style={{ color: '#016B61' }}> interactive games</span>
            <br />
            and AI-powered gesture recognition! ✨
          </motion.p>

          <motion.div
            className="flex gap-6 justify-center flex-wrap mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link href="/login" className="btn-primary">
              🚀 Get Started
            </Link>
            <Link href="/signup" className="btn-secondary">
              ✨ Sign Up Free
            </Link>
            <Link href="/gesture-test" className="btn-success">
              🤖 Try Demo
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.div
              className="card glass-card text-center"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                🎮
              </motion.div>
              <h3 className="font-bold text-2xl mb-3" style={{ color: '#016B61' }}>Interactive Games</h3>
              <p className="text-lg" style={{ color: '#70B2B2' }}>
                Solve math problems using sign language gestures in real-time
              </p>
            </motion.div>

            <motion.div
              className="card glass-card text-center"
              whileHover={{ scale: 1.05, rotateY: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                📊
              </motion.div>
              <h3 className="font-bold text-2xl mb-3" style={{ color: '#016B61' }}>Smart Analytics</h3>
              <p className="text-lg" style={{ color: '#70B2B2' }}>
                Track your progress with detailed insights and performance metrics
              </p>
            </motion.div>

            <motion.div
              className="card glass-card text-center"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✋
              </motion.div>
              <h3 className="font-bold text-2xl mb-3" style={{ color: '#016B61' }}>AI Recognition</h3>
              <p className="text-lg" style={{ color: '#70B2B2' }}>
                Advanced MediaPipe technology recognizes your hand gestures instantly
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
