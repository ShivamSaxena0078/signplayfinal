"use client"

import GestureTester from "@/components/GestureTester";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function GestureTestPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-black mb-6 gradient-text">
              AI Gesture Recognition Demo
            </h1>
            <p className="text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#70B2B2' }}>
              Test our AI-powered gesture recognition system!
              <br />Show your hand gestures and watch the magic happen ✨
            </p>
          </motion.div>
          
          <motion.div
            className="card glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GestureTester />
          </motion.div>
          
          <motion.div
            className="mt-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="card glass-card">
              <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#016B61' }}>
                🚀 How It Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📷</span>
                  <span className="text-lg" style={{ color: '#70B2B2' }}>Camera captures your gesture</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🤖</span>
                  <span className="text-lg" style={{ color: '#70B2B2' }}>AI analyzes hand position</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🧠</span>
                  <span className="text-lg" style={{ color: '#70B2B2' }}>Predicts number (0-9)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">⚡</span>
                  <span className="text-lg" style={{ color: '#70B2B2' }}>Instant results!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}