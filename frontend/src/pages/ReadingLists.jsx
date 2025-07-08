import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { readingListsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ReadingLists = () => {
  const { user } = useAuth();
  const [readingLists, setReadingLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newListData, setNewListData] = useState({
    name: '',
    description: '',
    is_public: false
  });

  useEffect(() => {
    if (user) {
      loadReadingLists();
    }
  }, [user]);

  const loadReadingLists = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await readingListsAPI.getUserReadingLists(user.id);
      if (response.data.success) {
        setReadingLists(response.data.data || []);
      } else {
        throw new Error(response.data.error || 'Failed to load reading lists');
      }
    } catch (error) {
      console.error('Error loading reading lists:', error);
      setError(error.message || 'Failed to load reading lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    
    if (!newListData.name.trim()) {
      return;
    }

    try {
      const response = await readingListsAPI.createReadingList(user.id, newListData);
      if (response.data.success) {
        setReadingLists(prev => [response.data.data, ...prev]);
        setNewListData({ name: '', description: '', is_public: false });
        setIsCreating(false);
      } else {
        throw new Error(response.data.error || 'Failed to create reading list');
      }
    } catch (error) {
      console.error('Error creating reading list:', error);
      setError(error.message || 'Failed to create reading list');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-200';
      case 'currently_reading':
        return 'bg-blue-900 text-blue-200';
      case 'want_to_read':
        return 'bg-gray-700 text-gray-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return '✓ Completed';
      case 'currently_reading':
        return '📖 Reading';
      case 'want_to_read':
        return '📚 Want to Read';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your reading lists.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">My Reading Lists</h1>
            <p className="text-gray-400">Organize and track your reading journey</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Create New List
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create New List Form */}
        {isCreating && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Create New Reading List</h2>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={newListData.name}
                  onChange={(e) => setNewListData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Summer Reads, Sci-Fi Favorites"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newListData.description}
                  onChange={(e) => setNewListData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your reading list..."
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={newListData.is_public}
                  onChange={(e) => setNewListData(prev => ({ ...prev, is_public: e.target.checked }))}
                  className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_public" className="ml-2 text-sm text-gray-300">
                  Make this list public (others can view it)
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Create List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewListData({ name: '', description: '', is_public: false });
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reading Lists Grid */}
        {readingLists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-8">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <h3 className="text-2xl font-semibold text-gray-300 mb-2">No reading lists yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Create your first reading list to start organizing your books by genre, mood, or any way you like!
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Create Your First List
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readingLists.map((list) => (
              <div key={list.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-white line-clamp-2">{list.name}</h3>
                  {list.is_public && (
                    <span className="bg-green-900 text-green-200 px-2 py-1 rounded text-xs">
                      Public
                    </span>
                  )}
                </div>
                
                {list.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{list.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{list.books_count || 0} books</span>
                  <span>Updated {new Date(list.updated_at).toLocaleDateString()}</span>
                </div>

                {/* Progress Summary */}
                {list.books_count > 0 && (
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Progress</span>
                      <span>{Math.round((list.completed_count || 0) / list.books_count * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(list.completed_count || 0) / list.books_count * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={`px-2 py-1 rounded ${getStatusColor('want_to_read')}`}>
                        {list.want_to_read_count || 0} to read
                      </span>
                      <span className={`px-2 py-1 rounded ${getStatusColor('currently_reading')}`}>
                        {list.currently_reading_count || 0} reading
                      </span>
                      <span className={`px-2 py-1 rounded ${getStatusColor('completed')}`}>
                        {list.completed_count || 0} done
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <a
                    href={`/reading-lists/${list.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center text-sm font-medium transition-colors duration-200"
                  >
                    View List
                  </a>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingLists; 