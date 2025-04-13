"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/components/hooks/use-debounced-dimensions"

interface PixelTrailProps {
  pixelSize: number // px
  fadeDuration?: number // ms
  delay?: number // ms
  className?: string
  pixelClassName?: string
  enableAutoAnimation?: boolean
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 20,
  fadeDuration = 500,
  delay = 0,
  className,
  pixelClassName,
  enableAutoAnimation = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const trailId = useRef(uuidv4())
  const [isHovering, setIsHovering] = useState(false)
  const snakePositionRef = useRef({ x: 0, y: 0, direction: 0 })
  const animationFrameRef = useRef<number | null>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`
      )
      if (pixelElement) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const animatePixel = (pixelElement as any).__animatePixel
        if (animatePixel) animatePixel()
      }
    },
    [pixelSize, trailId]
  )

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  // Auto animation function for snake-like movement
  const animateSnake = useCallback(() => {
    if (!containerRef.current || isHovering) return

    const container = containerRef.current
    const { x, y, direction } = snakePositionRef.current
    
    // Calculate new position based on current direction (0-7 for 8 directions)
    const speed = 1 // Move one cell at a time
    let newX = x
    let newY = y
    let newDirection = direction
    
    // Randomly change direction sometimes
    if (Math.random() < 0.05) {
      newDirection = (direction + Math.floor(Math.random() * 3) - 1 + 8) % 8
    }
    
    // Move in the current direction
    switch (newDirection) {
      case 0: newX += speed; break // right
      case 1: newX += speed; newY += speed; break // down-right
      case 2: newY += speed; break // down
      case 3: newX -= speed; newY += speed; break // down-left
      case 4: newX -= speed; break // left
      case 5: newX -= speed; newY -= speed; break // up-left
      case 6: newY -= speed; break // up
      case 7: newX += speed; newY -= speed; break // up-right
    }
    
    // Check boundaries and change direction if needed
    if (newX < 0) {
      newX = 0
      newDirection = 0 // Go right
    } else if (newX >= columns) {
      newX = columns - 1
      newDirection = 4 // Go left
    }
    
    if (newY < 0) {
      newY = 0
      newDirection = 2 // Go down
    } else if (newY >= rows) {
      newY = rows - 1
      newDirection = 6 // Go up
    }
    
    // Update position
    snakePositionRef.current = { x: newX, y: newY, direction: newDirection }
    
    // Activate the pixel
    const pixelElement = document.getElementById(
      `${trailId.current}-pixel-${newX}-${newY}`
    )
    if (pixelElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const animatePixel = (pixelElement as any).__animatePixel
      if (animatePixel) animatePixel()
    }
    
    // Continue the animation with a delay to slow it down
    animationFrameRef.current = setTimeout(() => {
      requestAnimationFrame(animateSnake)
    }, 250) as unknown as number // Add a 250ms delay between movements
  }, [columns, rows, isHovering, trailId])

  // Initialize and start/stop the auto animation
  useEffect(() => {
    if (!enableAutoAnimation) return
    
    // Initialize in the middle
    if (containerRef.current) {
      snakePositionRef.current = {
        x: Math.floor(columns / 2),
        y: Math.floor(rows / 2),
        direction: Math.floor(Math.random() * 8)
      }
    }
    
    // Start animation if not hovering
    if (!isHovering) {
      animationFrameRef.current = setTimeout(() => {
        requestAnimationFrame(animateSnake)
      }, 250) as unknown as number
    } else if (animationFrameRef.current) {
      clearTimeout(animationFrameRef.current as unknown as number)
      animationFrameRef.current = null
    }
    
    return () => {
      if (animationFrameRef.current) {
        clearTimeout(animationFrameRef.current as unknown as number)
        animationFrameRef.current = null
      }
      
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }
    }
  }, [enableAutoAnimation, isHovering, animateSnake, columns, rows])

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    setIsHovering(true)
  }
  
  const handleMouseLeave = () => {
    // Add a 1-second delay before restarting animation after hover ends
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovering(false)
      hoverTimeoutRef.current = null
    }, 1000)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface PixelDotProps {
  id: string
  size: number
  fadeDuration: number
  delay: number
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, size, fadeDuration, delay, className }) => {
    const controls = useAnimationControls()

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      })
    }, [controls, fadeDuration, delay])

    // Attach the animatePixel function to the DOM element
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (node as any).__animatePixel = animatePixel
        }
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"
export { PixelTrail } 