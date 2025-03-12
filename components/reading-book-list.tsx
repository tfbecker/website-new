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
  
  // Generate the star rating
  const stars = "★".repeat(book.rating);

  return (
    <div 
      className="border rounded-lg p-4 relative cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setShowFullReview(true)}
      onMouseLeave={() => setShowFullReview(false)}
      onClick={() => setShowFullReview(prev => !prev)}
    >
      <div className="flex-shrink-0 flex justify-center items-start h-[250px] mb-4">
        <Image 
          src={book.cover} 
          alt={book.title} 
          width={150} 
          height={225} 
          className="object-contain max-h-full" 
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 flex justify-between">
          <span>{book.title}</span>
          <span className="text-black ml-2">{stars}</span>
        </h3>
        <p className="text-sm text-gray-600 flex-grow">
          {truncatedReview}{book.review.length > 200 && '...'}
        </p>
      </div>
      {showFullReview && (
        <div className="absolute top-0 left-0 z-10 w-full h-full bg-white bg-opacity-95 p-4 border rounded shadow-md overflow-auto">
          <p className="text-sm text-gray-800">{book.review}</p>
        </div>
      )}
    </div>
  )
}

export default function ReadingBookList({ books }: ReadingBookListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookItem key={book.title} book={book} />
      ))}
    </div>
  )
} 