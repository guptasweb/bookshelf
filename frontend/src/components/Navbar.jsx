import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl">Bookshelf</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive('/books') 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Discover
            </Link>
            {user && (
              <Link
                to="/reading-lists"
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive('/reading-lists') 
                    ? 'text-blue-400 border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                My Lists
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.name}</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/reading-lists"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Reading Lists
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isActive('/') 
                  ? 'text-blue-400 bg-gray-900' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/books"
              className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                isActive('/books') 
                  ? 'text-blue-400 bg-gray-900' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </Link>
            {user && (
              <Link
                to="/reading-lists"
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive('/reading-lists') 
                    ? 'text-blue-400 bg-gray-900' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                My Lists
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 