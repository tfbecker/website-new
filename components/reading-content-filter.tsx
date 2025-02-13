"use client"

import { useState } from "react";
import ReadingBookList from "@/components/reading-book-list";

interface Book {
  title: string;
  cover: string;
  rating: number;
  review: string;
}

interface ReadingContentFilterProps {
  books: Book[];
}

export default function ReadingContentFilter({ books }: ReadingContentFilterProps) {
  const [filter, setFilter] = useState(false);
  
  // When filter is active, show only books with rating 4 and 5
  const filteredBooks = filter ? books.filter(book => book.rating >= 4) : books;
  
  return (
    <div className="px-6 md:px-16 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4">
        <div className="mb-4">
          <p className="text-sm">
            This section contains my reading journal with cover images, star ratings, and short reviews. Hover or click on a review to see the full text.
          </p>
        </div>
        <div className="mb-12">
          <button
            onClick={() => setFilter(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Don&apos;t show me Maybes
          </button>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <ReadingBookList books={filteredBooks} />
      </div>
    </div>
  );
} 