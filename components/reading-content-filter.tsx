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
    <div className="px-6 md:px-16 flex flex-col md:flex-row">
      <div className="w-full md:w-1/4">
        <div className="mb-4">
          <p className="text-sm">
            This section contains my reading journal with cover images, star ratings, and short reviews. Hover or click on a review to see the full text.
          </p>
        </div>
      </div>
      <div className="w-full md:w-3/4">
        <ReadingBookList books={filteredBooks} />
      </div>
    </div>
  );
} 