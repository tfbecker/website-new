'use client'

import { useState, useEffect } from 'react'

export function MarioHUD() {
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [time, setTime] = useState(400)

  // Decrement timer for fun effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => prev > 0 ? prev - 1 : 400)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Increment score periodically for fun
  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setScore(prev => prev + 100)
      setCoins(prev => (prev + 1) % 100)
    }, 5000)
    return () => clearInterval(scoreTimer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm px-4 py-2">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Score */}
        <div className="text-center">
          <p className="font-pixel text-[8px] md:text-xs text-white">FELIX</p>
          <p className="font-pixel text-[10px] md:text-sm text-white">{String(score).padStart(6, '0')}</p>
        </div>

        {/* Coins */}
        <div className="text-center flex items-center gap-1">
          <span className="coin !w-3 !h-4 md:!w-4 md:!h-5 !animate-none"></span>
          <p className="font-pixel text-[10px] md:text-sm text-mario-gold">x{String(coins).padStart(2, '0')}</p>
        </div>

        {/* World */}
        <div className="text-center">
          <p className="font-pixel text-[8px] md:text-xs text-white">WORLD</p>
          <p className="font-pixel text-[10px] md:text-sm text-white">1-1</p>
        </div>

        {/* Time */}
        <div className="text-center">
          <p className="font-pixel text-[8px] md:text-xs text-white">TIME</p>
          <p className="font-pixel text-[10px] md:text-sm text-white">{time}</p>
        </div>
      </div>
    </div>
  )
}
