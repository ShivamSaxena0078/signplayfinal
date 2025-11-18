"use client"

import Link from "next/link"
import { useAuth } from "./context/AuthContext"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <motion.nav
      className="shadow-lg sticky top-0 z-50"
      style={{ backgroundColor: '#016B61', color: '#E5E9C5' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="font-black text-3xl hover:opacity-80 transition-opacity" style={{ color: '#E5E9C5' }}>
            ✋ SignPlay
          </Link>
        </motion.div>

        <div className="flex items-center gap-8">
          {user ? (
            <>
              <motion.span
                className="text-lg font-semibold"
                style={{ color: '#E5E9C5' }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Hey, {user.name}! 👋
              </motion.span>
              
              <div className="flex items-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/dashboard" className="font-semibold transition-colors" style={{ color: '#E5E9C5' }}>
                    📊 Dashboard
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/game" className="font-semibold transition-colors" style={{ color: '#E5E9C5' }}>
                    🎮 Game
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/gesture-guide" className="font-semibold transition-colors" style={{ color: '#E5E9C5' }}>
                    📚 Guide
                  </Link>
                </motion.div>
                
                <motion.button
                  onClick={handleLogout}
                  className="px-6 py-3 rounded-2xl font-bold transition-all border-2"
                  style={{ 
                    backgroundColor: '#70B2B2', 
                    color: '#E5E9C5',
                    borderColor: '#9ECFD4'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="font-semibold text-lg transition-colors" style={{ color: '#E5E9C5' }}>
                  Login
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-2xl font-bold transition-all border-2"
                  style={{ 
                    backgroundColor: '#70B2B2', 
                    color: '#E5E9C5',
                    borderColor: '#9ECFD4'
                  }}
                >
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
