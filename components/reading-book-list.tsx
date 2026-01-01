"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Book {
  title: string
  cover: string
  rating: number
  review: string
}

interface ReadingBookListProps {
  books: Book[]
}

function BookItem({ book }: { book: Book }) {
  const [showFullReview, setShowFullReview] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const truncatedReview = book.review.length > 150 ? book.review.slice(0, 150) : book.review

  // Generate coin icons for rating (Mario style)
  const coins = "🪙".repeat(book.rating);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleMouseEnter = () => {
    if (!isTouchDevice) setShowFullReview(true)
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) setShowFullReview(false)
  }

  const handleClick = () => {
    if (isTouchDevice) setShowFullReview(prev => !prev)
  }

  return (
    <div
      className="mario-card p-2 sm:p-4 relative cursor-pointer h-full flex flex-col min-h-[280px] sm:min-h-[360px] group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Question mark hint on hover */}
      <div className="absolute -top-3 -right-3 w-8 h-8 question-block text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20" />
      <div className="flex-shrink-0 flex justify-center items-start h-[140px] sm:h-[200px] mb-2 sm:mb-4">
        <Image
          src={book.cover}
          alt={book.title}
          width={120}
          height={180}
          className="object-contain max-h-full border-2 border-mario-brown/30"
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="font-pixel text-[8px] sm:text-xs text-mario-brown mb-1 sm:mb-2 leading-tight">
          <span className="line-clamp-2">{book.title}</span>
        </h3>
        <div className="text-[10px] sm:text-sm mb-1">{coins}</div>
        <p className="text-[10px] sm:text-xs text-mario-brown/70 flex-grow line-clamp-3">
          {truncatedReview}{book.review.length > 150 && '...'}
        </p>
      </div>
      {showFullReview && (
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-white/98 p-3 sm:p-4 border-4 border-mario-pipe shadow-pixel overflow-auto">
          <p className="text-[10px] sm:text-sm text-mario-brown leading-relaxed">{book.review}</p>
        </div>
      )}
    </div>
  )
}

export default function ReadingBookList({ books }: ReadingBookListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {books.map((book) => (
        <BookItem key={book.title} book={book} />
      ))}
    </div>
  )
} 