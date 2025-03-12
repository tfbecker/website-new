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
    <div className="flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-1/4">
        <div className="rounded-lg bg-gray-100 p-6">
          <p className="text-sm">
            This review section is a forcing function to read more
          </p>
        </div>
      </div>
      <div className="flex-1">
        <ReadingBookList books={filteredBooks} />
      </div>
    </div>
  );
} 