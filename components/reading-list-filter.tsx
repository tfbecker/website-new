"use client"

import { useState } from "react";
import ReadingBookList from "@/components/reading-book-list";

interface Book {
  title: string;
  cover: string;
  rating: number;
  review: string;
}

interface ReadingListFilterProps {
  books: Book[];
}

export default function ReadingListFilter({ books }: ReadingListFilterProps) {
  const [filter, setFilter] = useState(false);
  
  // When filter is active, show only books with rating 4 and 5
  const filteredBooks = filter ? books.filter(book => book.rating >= 4) : books;
  
  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setFilter(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Don&apos;t show me Maybes
        </button>
      </div>
      <ReadingBookList books={filteredBooks} />
    </>
  );
} 