'use client'

import { useEffect, useState } from 'react'

export default function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl animate-float" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl animate-bounce-slow" />
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-pink-400 to-red-400 rounded-full opacity-20 blur-xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-40 w-24 h-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-20 blur-xl animate-float" />
      
      {/* Geometric shapes */}
      <div className="absolute top-60 left-1/4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rotate-45 opacity-30 animate-bounce-slow" />
      <div className="absolute bottom-60 right-1/4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-400 rotate-12 opacity-30 animate-pulse-slow" />
    </div>
  )
}