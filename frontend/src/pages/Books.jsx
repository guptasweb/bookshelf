import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import LoadingSpinner from '../components/LoadingSpinner';
import { booksAPI, recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');

  // Load initial popular books
  useEffect(() => {
    loadInitialBooks();
  }, []);

  const loadInitialBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await booksAPI.getPopular(null, 20);
      if (response.data.success) {
        setBooks(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to load books');
      }
    } catch (error) {
      console.error('Error loading books:', error);
      setError(error.message || 'Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query, searchType) => {
    if (!query.trim()) {
      loadInitialBooks();
      setHasSearched(false);
      return;
    }

    setSearchLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await booksAPI.search(query, searchType, { limit: 20 });
      if (response.data.success) {
        setBooks(response.data.data?.books || []);
      } else {
        throw new Error(response.data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'Search failed');
      setBooks([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const loadNewReleases = async () => {
    setLoading(true);
    setError(null);
    setActiveTab('new');
    
    try {
      const response = await booksAPI.getNewReleases(20);
      if (response.data.success) {
        setBooks(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to load new releases');
      }
    } catch (error) {
      console.error('Error loading new releases:', error);
      setError(error.message || 'Failed to load new releases');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    if (!user) {
      alert('Please log in to view personalized recommendations');
      return;
    }

    setLoading(true);
    setError(null);
    setActiveTab('recommendations');
    
    try {
      const response = await recommendationsAPI.getPersonalRecommendations();
      if (response.data.success) {
        setBooks(response.data.data?.books || []);
      } else {
        throw new Error(response.data.error || 'Failed to load recommendations');
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setError(error.message || 'Failed to load recommendations');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (hasSearched) return 'Search Results';
    if (activeTab === 'new') return 'New Releases';
    if (activeTab === 'recommendations') return 'Recommended for You';
    return 'Popular Books';
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Discover Your Next
            <span className="text-blue-400 block">Great Read</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Search millions of books, discover new authors, and find your perfect reading companion
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar 
            onSearch={handleSearch} 
            loading={searchLoading}
            placeholder="Search books, authors, ISBN, or subjects..."
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('discover');
              loadInitialBooks();
              setHasSearched(false);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
              activeTab === 'discover' && !hasSearched
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            🔥 Popular
          </button>
          
          <button
            onClick={loadNewReleases}
            className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            ✨ New Releases
          </button>
          
          {user && (
            <button
              onClick={loadRecommendations}
              className={`px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
                activeTab === 'recommendations'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              🎯 For You
            </button>
          )}
          
          <button
            onClick={() => handleSearch('fiction', 'subject')}
            className="px-6 py-3 rounded-full font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            📚 Fiction
          </button>
          
          <button
            onClick={() => handleSearch('science', 'subject')}
            className="px-6 py-3 rounded-full font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            🔬 Science
          </button>
        </div>

        {/* Loading State */}
        {(loading || searchLoading) && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-400 mt-4">
                {searchLoading ? 'Searching books...' : 'Loading books...'}
              </p>
            </div>
          </div>
        )}

        {/* Books List */}
        {!loading && !searchLoading && (
          <BookList
            books={books}
            loading={false}
            error={error}
            title={getTitle()}
            showFilters={true}
          />
        )}

        {/* Empty State */}
        {!loading && !searchLoading && books.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-8">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No books found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {hasSearched 
                  ? "Try adjusting your search terms or browse our popular books instead."
                  : "We're having trouble loading books right now. Please try again later."
                }
              </p>
            </div>
            {hasSearched && (
              <button
                onClick={() => {
                  setHasSearched(false);
                  setActiveTab('discover');
                  loadInitialBooks();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Browse Popular Books
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books; 