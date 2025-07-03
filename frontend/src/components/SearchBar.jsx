import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = "Search books, authors, or ISBN...", loading = false }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), searchType);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', searchType);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="flex">
          {/* Search Type Selector */}
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-gray-800 text-white px-4 py-4 rounded-l-2xl border-r border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="general">All</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="isbn">ISBN</option>
            <option value="subject">Subject</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-gray-800 text-white px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            disabled={loading}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-800 text-gray-400 hover:text-white px-4 py-4 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Search Button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white px-8 py-4 rounded-r-2xl font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span>Search</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Search Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {['Harry Potter', 'Science Fiction', 'Mystery', 'Romance', 'Biography'].map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion, searchType);
            }}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-full text-sm transition-colors duration-200"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </form>
  );
};

export default SearchBar; 