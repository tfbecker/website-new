"use client"

import { useState } from 'react'
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
  const truncatedReview = book.review.length > 200 ? book.review.slice(0, 200) : book.review

  return (
    <div 
      className="border rounded-lg p-4 relative cursor-pointer max-w-[250px]"
      onMouseEnter={() => setShowFullReview(true)}
      onMouseLeave={() => setShowFullReview(false)}
      onClick={() => setShowFullReview(prev => !prev)}
    >
      <Image src={book.cover} alt={book.title} width={200} height={300} className="mb-4" />
      <h3 className="text-lg font-bold mb-2">{book.title}</h3>
      <div className="flex items-center mb-2">
        {Array.from({length: book.rating}).map((_, i) => (
          <span key={i} className="text-black text-xl">★</span>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        {truncatedReview}{book.review.length > 200 && '...'}
      </p>
      {showFullReview && (
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-white bg-opacity-95 p-4 border rounded shadow-md">
          <p className="text-sm text-gray-800">{book.review}</p>
        </div>
      )}
    </div>
  )
}

export default function ReadingBookList({ books }: ReadingBookListProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
      {books.map((book) => (
        <BookItem key={book.title} book={book} />
      ))}
    </div>
  )
} 