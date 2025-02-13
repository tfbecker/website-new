"use client"

import { useState, useRef } from 'react'

interface HoverImageProps {
  src: string
  alt: string
  className?: string
}

export function HoverImage({ src, alt, className }: HoverImageProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPreview(true)
    }, 500) // 0.5 second delay
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowPreview(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={className}
      />
      
      {showPreview && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${mousePosition.x + 20}px`,
            top: `${mousePosition.y - 100}px`,
            transform: 'translate(0, -50%)',
          }}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-[800px] max-h-[80vh] shadow-2xl"
          />
        </div>
      )}
    </div>
  )
} 