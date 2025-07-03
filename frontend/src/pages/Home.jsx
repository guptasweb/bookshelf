import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookList from '../components/BookList';
import LoadingSpinner from '../components/LoadingSpinner';
import { booksAPI, recommendationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [user]);

  const loadHomeData = async () => {
    setLoading(true);
    
    try {
      // Load featured/popular books
      const featuredResponse = await booksAPI.getPopular(null, 8);
      if (featuredResponse.data.success) {
        setFeaturedBooks(featuredResponse.data.data || []);
      }

      // Load recommendations if user is logged in
      if (user) {
        try {
          const recResponse = await recommendationsAPI.getPersonalRecommendations();
          if (recResponse.data.success) {
            setRecommendedBooks(recResponse.data.data?.books?.slice(0, 6) || []);
          }
        } catch (error) {
          console.error('Error loading recommendations:', error);
          // Fallback to popular books if recommendations fail
          setRecommendedBooks(featuredBooks.slice(0, 6));
        }
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query, searchType) => {
    // Redirect to books page with search
    const searchParams = new URLSearchParams({
      q: query,
      type: searchType
    });
    window.location.href = `/books?${searchParams.toString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Your Personal
              <span className="text-blue-400 block">Digital Library</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover millions of books, track your reading journey, and connect with a community of book lovers
            </p>
            
            {/* Search Bar */}
            <div className="mb-12">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="What would you like to read today?"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/books"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 min-w-[200px]"
              >
                Explore Books
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200 min-w-[200px]"
                >
                  Join Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              📚 Popular This Week
            </h2>
            <p className="text-gray-400 text-lg">
              Discover what everyone's reading right now
            </p>
          </div>
          
          <BookList
            books={featuredBooks}
            loading={false}
            showFilters={false}
            compact={true}
            title=""
          />
          
          <div className="text-center mt-8">
            <Link
              to="/books"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
            >
              View All Books
              <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {user && recommendedBooks.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                🎯 Recommended for You
              </h2>
              <p className="text-gray-400 text-lg">
                Personalized picks based on your reading history
              </p>
            </div>
            
            <BookList
              books={recommendedBooks}
              loading={false}
              showFilters={false}
              compact={true}
              title=""
            />
            
            <div className="text-center mt-8">
              <Link
                to="/books"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                View All Recommendations
                <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Bookshelf?
            </h2>
            <p className="text-gray-400 text-lg">
              Everything you need for your reading journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Find any book with our powerful search powered by Google Books API'
              },
              {
                icon: '📖',
                title: 'Reading Lists',
                description: 'Organize your books into custom lists and track your reading progress'
              },
              {
                icon: '⭐',
                title: 'Reviews & Ratings',
                description: 'Share your thoughts and discover what others think about books'
              },
              {
                icon: '🎯',
                title: 'Recommendations',
                description: 'Get personalized book suggestions based on your reading history'
              },
              {
                icon: '📱',
                title: 'Mobile Friendly',
                description: 'Access your library anywhere with our responsive design'
              },
              {
                icon: '🆓',
                title: 'Completely Free',
                description: 'All features are free forever. No hidden costs or subscriptions'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg bg-gray-800/50">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Reading Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of readers who have already discovered their next favorite book
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200"
              >
                Sign Up Free
              </Link>
              <Link
                to="/books"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors duration-200"
              >
                Browse Books
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home; 