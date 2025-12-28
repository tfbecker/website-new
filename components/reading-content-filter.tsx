"use client"

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
  // Always filter out books with rating 3 or less
  const filteredBooks = books.filter(book => book.rating >= 4);
  
  return (
    <ReadingBookList books={filteredBooks} />
  );
} 