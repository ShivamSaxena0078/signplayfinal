"use client";

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export default function GestureTester() {
  const webcamRef = useRef<Webcam | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#016B61', '#70B2B2', '#9ECFD4', '#E5E9C5']
    });
  };

  const captureAndPredict = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Could not capture frame");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const res = await axios.post("/api/gesture/predict", {
        image: imageSrc,
      });

      if (res.data.error === "no_hand_detected") {
        setError("No hand detected - show your hand clearly! 👋");
      } else {
        setPrediction(res.data.prediction);
        triggerCelebration();
      }
    } catch (e: any) {
      console.error(e);
      setError("Prediction failed - try again! 🔄");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <motion.h2
        className="text-4xl font-black gradient-text text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🤖 AI Gesture Recognition
      </motion.h2>
      
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="rounded-3xl border-4 shadow-2xl"
          style={{ borderColor: '#70B2B2' }}
        />
      </motion.div>

      <motion.button
        onClick={captureAndPredict}
        disabled={loading}
        className={`btn-primary text-xl px-12 py-6 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        whileHover={!loading ? { scale: 1.05 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {loading ? (
          <motion.div
            className="flex items-center gap-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⏳ Analyzing...
          </motion.div>
        ) : (
          "📸 Capture & Predict"
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {prediction !== null && (
          <motion.div
            key="prediction"
            className="text-center"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -30 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <div className="card glass-card text-center">
              <motion.div
                className="text-8xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🎉
              </motion.div>
              <h3 className="text-3xl font-bold mb-2" style={{ color: '#016B61' }}>Detected Gesture:</h3>
              <motion.div
                className="text-9xl font-black mb-4"
                style={{ color: '#016B61' }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {prediction}
              </motion.div>
              <p className="text-xl" style={{ color: '#70B2B2' }}>Amazing! Your gesture was recognized! ✨</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            className="text-center"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card glass-card text-center">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🤔
              </motion.div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#016B61' }}>Oops!</h3>
              <p className="text-xl" style={{ color: '#70B2B2' }}>{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="card glass-card max-w-2xl text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-2xl font-bold mb-4" style={{ color: '#016B61' }}>💡 Tips for Best Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ color: '#70B2B2' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <span>Good lighting</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📏</span>
            <span>12-18 inches away</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">✋</span>
            <span>Clear hand gestures</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏱️</span>
            <span>Hold for 2-3 seconds</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}