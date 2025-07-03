import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const BookCard = ({ book, onRead, onAddToList, compact = false }) => {
  const {
    id,
    title,
    subtitle,
    authors_list,
    cover_image,
    average_rating,
    reviews_count,
    description_excerpt,
    published_year
  } = book;

  const authorNames = authors_list?.join(', ') || 'Unknown Author';
  const coverUrl = cover_image?.medium || cover_image?.small || '/images/book-placeholder.png';

  if (compact) {
    return (
      <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors duration-200">
        <div className="flex items-center space-x-4">
          <img
            src={coverUrl}
            alt={title}
            className="w-16 h-20 object-cover rounded-md flex-shrink-0"
            onError={(e) => {
              e.target.src = '/images/book-placeholder.png';
            }}
          />
          <div className="flex-1 min-w-0">
            <Link
              to={`/books/${id}`}
              className="text-white font-semibold text-lg hover:text-blue-400 transition-colors line-clamp-2"
            >
              {title}
            </Link>
            <p className="text-gray-400 text-sm mt-1">{authorNames}</p>
            <div className="flex items-center mt-2">
              <StarRating rating={average_rating} size="small" />
              <span className="text-yellow-400 ml-2 text-sm font-medium">
                {average_rating?.toFixed(1) || '0.0'}
              </span>
              {reviews_count > 0 && (
                <span className="text-gray-400 text-sm ml-1">
                  ({reviews_count} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex space-x-6">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <img
            src={coverUrl}
            alt={title}
            className="w-32 h-48 object-cover rounded-xl shadow-lg"
            onError={(e) => {
              e.target.src = '/images/book-placeholder.png';
            }}
          />
        </div>

        {/* Book Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <Link
                to={`/books/${id}`}
                className="text-white font-bold text-2xl hover:text-blue-400 transition-colors duration-200 line-clamp-2 leading-tight"
              >
                {title}
              </Link>
              {subtitle && (
                <p className="text-gray-400 text-lg mt-1 line-clamp-1">{subtitle}</p>
              )}
              <p className="text-gray-300 text-lg mt-2 font-medium">{authorNames}</p>
              {published_year && (
                <p className="text-gray-500 text-sm mt-1">{published_year}</p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-3 ml-4">
              <StarRating rating={average_rating} size="large" />
              <span className="text-yellow-400 text-xl font-bold">
                {average_rating?.toFixed(1) || '0.0'}
              </span>
            </div>
          </div>

          {/* Reviews Count */}
          {reviews_count > 0 && (
            <div className="mb-4">
              <span className="text-gray-400 text-sm">
                {reviews_count.toLocaleString()} reviews
              </span>
            </div>
          )}

          {/* Description */}
          {description_excerpt && (
            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
              {description_excerpt}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => onRead && onRead(book)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Read
            </button>
            <button
              onClick={() => onAddToList && onAddToList(book)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Add to List
            </button>
            <Link
              to={`/books/${id}`}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard; 