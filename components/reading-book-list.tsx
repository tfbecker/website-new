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

  // Generate the star rating
  const stars = "★".repeat(book.rating);

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
      className="border rounded-lg p-2 sm:p-4 relative cursor-pointer h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 flex justify-center items-start h-[180px] sm:h-[250px] mb-2 sm:mb-4">
        <Image 
          src={book.cover} 
          alt={book.title} 
          width={120} 
          height={180} 
          className="object-contain max-h-full" 
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">
          <span className="line-clamp-2">{book.title}</span>
          <span className="text-xs sm:text-sm text-black mt-1">{stars}</span>
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 flex-grow line-clamp-3">
          {truncatedReview}{book.review.length > 150 && '...'}
        </p>
      </div>
      {showFullReview && (
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-white bg-opacity-95 p-4 border rounded shadow-md overflow-auto">
          <p className="text-xs sm:text-sm text-gray-800">{book.review}</p>
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