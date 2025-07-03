import React, { useState } from 'react';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const BookList = ({ 
  books = [], 
  loading = false, 
  error = null, 
  title = "Books",
  showFilters = true,
  compact = false
}) => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState('title');
  const [filterBy, setFilterBy] = useState('all');

  const handleRead = (book) => {
    // TODO: Implement read functionality
    console.log('Reading book:', book.title);
  };

  const handleAddToList = (book) => {
    if (!user) {
      alert('Please log in to add books to your reading list');
      return;
    }
    // TODO: Implement add to reading list functionality
    console.log('Adding to list:', book.title);
  };

  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.average_rating || 0) - (a.average_rating || 0);
      case 'reviews':
        return (b.reviews_count || 0) - (a.reviews_count || 0);
      case 'year':
        return (b.published_year || 0) - (a.published_year || 0);
      case 'title':
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const filteredBooks = sortedBooks.filter(book => {
    if (filterBy === 'all') return true;
    if (filterBy === 'highRated') return (book.average_rating || 0) >= 4.0;
    if (filterBy === 'recent') return book.published_year >= 2020;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-lg mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredBooks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
          </svg>
          No books found
        </div>
        <p className="text-gray-500">
          Try adjusting your search or filters to find more books.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">
          {title}
          <span className="text-gray-400 text-lg font-normal ml-2">
            ({filteredBooks.length} books)
          </span>
        </h2>

        {/* Filters and Sort */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Books</option>
              <option value="highRated">High Rated (4.0+)</option>
              <option value="recent">Recent (2020+)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Sort by Title</option>
              <option value="rating">Sort by Rating</option>
              <option value="reviews">Sort by Reviews</option>
              <option value="year">Sort by Year</option>
            </select>
          </div>
        )}
      </div>

      {/* Books Grid */}
      <div className={`space-y-6 ${compact ? 'space-y-4' : 'space-y-8'}`}>
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onRead={handleRead}
            onAddToList={handleAddToList}
            compact={compact}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList; 