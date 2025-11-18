"use client"

import Navbar from "@/components/Navbar"
import { motion } from "framer-motion"
import Image from "next/image"

const gestureData = [
  {
    number: 0,
    name: "Zero",
    description: "Make a closed fist with thumb tucked inside",
    tips: "Keep your fist closed and thumb hidden inside"
  },
  {
    number: 1,
    name: "One", 
    description: "Point your index finger up, other fingers closed",
    tips: "Keep your index finger straight and tall"
  },
  {
    number: 2,
    name: "Two",
    description: "Show index and middle finger in a 'V' shape",
    tips: "Make a clear 'V' with your fingers"
  },
  {
    number: 3,
    name: "Three",
    description: "Show index, middle, and ring finger extended",
    tips: "Keep three fingers straight and separated"
  },
  {
    number: 4,
    name: "Four",
    description: "Show four fingers extended, thumb folded",
    tips: "All four fingers up, thumb against palm"
  },
  {
    number: 5,
    name: "Five",
    description: "Open hand with all five fingers spread wide",
    tips: "Spread all fingers wide like saying 'stop'"
  },
  {
    number: 6,
    name: "Six",
    description: "Touch thumb to pinky, other three fingers up",
    tips: "Thumb touches pinky tip, three fingers straight"
  },
  {
    number: 7,
    name: "Seven",
    description: "Touch thumb to ring finger, others extended",
    tips: "Thumb touches ring finger, three fingers up"
  },
  {
    number: 8,
    name: "Eight",
    description: "Touch thumb to middle finger, others up",
    tips: "Thumb touches middle finger, three fingers up"
  },
  {
    number: 9,
    name: "Nine",
    description: "Touch thumb to index finger forming a circle",
    tips: "Make an 'OK' sign with thumb and index finger"
  }
]

export default function GestureGuidePage() {
  return (
    <main className="min-h-screen pb-12">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-black mb-6 gradient-text">
            Sign Language Guide ✋
          </h1>
          <p className="text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#70B2B2' }}>
            Master the art of sign language numbers! Each gesture is a step toward 
            <span className="font-bold" style={{ color: '#016B61' }}> fluent communication</span>
          </p>
        </motion.div>

        {/* Main ASL Numbers Image */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="card glass-card text-center">
            <h2 className="text-3xl font-bold mb-6" style={{ color: '#016B61' }}>
              American Sign Language Numbers (0-9)
            </h2>
            <div className="relative mb-6 overflow-hidden rounded-2xl">
              <Image
                src="https://www.mdpi.com/electronics/electronics-10-00182/article_deploy/html/images/electronics-10-00182-g001.png"
                alt="Complete ASL numeric set showing hand gestures for numbers 0-9"
                width={900}
                height={500}
                className="w-full h-auto object-contain rounded-2xl border-4"
                style={{ borderColor: '#70B2B2' }}
                priority
              />
            </div>
            <p className="text-lg mb-4" style={{ color: '#70B2B2' }}>
              Study each hand position carefully. Practice these gestures in front of a mirror before using the camera.
            </p>
          </div>
        </motion.div>

        {/* Individual Number Descriptions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {gestureData.map((gesture, index) => (
            <motion.div
              key={gesture.number}
              className="card glass-card text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="gesture-number-card mx-auto mb-4"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                {gesture.number}
              </motion.div>
              
              <h3 className="text-xl font-bold mb-3" style={{ color: '#016B61' }}>{gesture.name}</h3>
              
              <div className="space-y-3">
                <p className="text-sm leading-relaxed" style={{ color: '#70B2B2' }}>{gesture.description}</p>
                <div className="rounded-xl p-3" style={{ backgroundColor: '#E5E9C5' }}>
                  <p className="text-xs font-semibold" style={{ color: '#016B61' }}>💡 Tip:</p>
                  <p className="text-xs" style={{ color: '#70B2B2' }}>{gesture.tips}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="card glass-card max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8" style={{ color: '#016B61' }}>Learning & Practice Guide 🎯</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#016B61' }}>Study First</h3>
                <p style={{ color: '#70B2B2' }}>
                  Examine the reference image above carefully. Notice the finger positions and hand shapes for each number.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🪞</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#016B61' }}>Practice with Mirror</h3>
                <p style={{ color: '#70B2B2' }}>
                  Use a mirror to practice each gesture. Make sure your hand position matches the reference image.
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-3" style={{ color: '#016B61' }}>Test with AI</h3>
                <p style={{ color: '#70B2B2' }}>
                  Once comfortable, use our gesture recognition system to test your accuracy and get feedback.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ color: '#70B2B2' }}>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#016B61' }}>Camera Tips 📸</h3>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Good Lighting</h4>
                    <p className="text-sm">Ensure your hand is well-lit and clearly visible</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📏</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Proper Distance</h4>
                    <p className="text-sm">Keep your hand 12-18 inches from the camera</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">⏱️</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Hold Steady</h4>
                    <p className="text-sm">Hold each gesture for 2-3 seconds before capturing</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#016B61' }}>Common Mistakes ⚠️</h3>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">👆</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Finger Position</h4>
                    <p className="text-sm">Make sure fingers are clearly separated and positioned correctly</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">👍</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Thumb Placement</h4>
                    <p className="text-sm">Pay attention to where your thumb should be for each number</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✋</div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#016B61' }}>Hand Orientation</h4>
                    <p className="text-sm">Keep your palm facing the camera as shown in the reference</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}