import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
const API_VERSION = process.env.REACT_APP_API_VERSION || 'v1';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api/${API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { user: { email, password } }),
  
  register: (name, email, password) => 
    api.post('/auth/register', { user: { name, email, password } }),
  
  logout: () => 
    api.delete('/auth/logout'),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  updateProfile: (profileData) => 
    api.put('/auth/profile', { user: profileData }),
};

// Books API
export const booksAPI = {
  search: (query, searchType = 'general', options = {}) => 
    api.get('/books/search', { 
      params: { q: query, search_type: searchType, ...options } 
    }),
  
  getBooks: (params = {}) => 
    api.get('/books', { params }),
  
  getBook: (id) => 
    api.get(`/books/${id}`),
  
  importBook: (googleBooksId) => 
    api.post('/books/import', { google_books_id: googleBooksId }),
  
  getPopular: (subject = null, limit = 20) => 
    api.get('/books/popular', { params: { subject, limit } }),
  
  getNewReleases: (limit = 20) => 
    api.get('/books/new_releases', { params: { limit } }),
  
  createBook: (bookData) => 
    api.post('/books', { book: bookData }),
  
  updateBook: (id, bookData) => 
    api.put(`/books/${id}`, { book: bookData }),
  
  deleteBook: (id) => 
    api.delete(`/books/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getBookReviews: (bookId, params = {}) => 
    api.get(`/books/${bookId}/reviews`, { params }),
  
  createReview: (bookId, reviewData) => 
    api.post(`/books/${bookId}/reviews`, { review: reviewData }),
  
  updateReview: (id, reviewData) => 
    api.put(`/reviews/${id}`, { review: reviewData }),
  
  deleteReview: (id) => 
    api.delete(`/reviews/${id}`),
  
  markHelpful: (bookId, reviewId) => 
    api.post(`/books/${bookId}/reviews/${reviewId}/mark_helpful`),
  
  getUserReviews: (userId, params = {}) => 
    api.get(`/users/${userId}/reviews`, { params }),
};

// Reading Lists API
export const readingListsAPI = {
  getUserReadingLists: (userId, params = {}) => 
    api.get(`/users/${userId}/reading_lists`, { params }),
  
  getReadingList: (id) => 
    api.get(`/reading_lists/${id}`),
  
  createReadingList: (userId, listData) => 
    api.post(`/users/${userId}/reading_lists`, { reading_list: listData }),
  
  updateReadingList: (id, listData) => 
    api.put(`/reading_lists/${id}`, { reading_list: listData }),
  
  deleteReadingList: (id) => 
    api.delete(`/reading_lists/${id}`),
  
  addBookToList: (listId, bookId, status = 'want_to_read', notes = '') => 
    api.post(`/reading_lists/${listId}/add_book`, { 
      book_id: bookId, 
      status, 
      notes 
    }),
  
  removeBookFromList: (listId, bookId) => 
    api.delete(`/reading_lists/${listId}/remove_book`, { 
      params: { book_id: bookId } 
    }),
  
  updateProgress: (listId, bookId, progressData) => 
    api.put(`/reading_lists/${listId}/update_progress`, { 
      book_id: bookId, 
      reading_list_item: progressData 
    }),
};

// Recommendations API
export const recommendationsAPI = {
  getPersonalRecommendations: () => 
    api.get('/recommendations'),
  
  getBookRecommendations: (bookId, limit = 10) => 
    api.get(`/recommendations/for_book/${bookId}`, { params: { limit } }),
  
  getGenreRecommendations: (genre, limit = 20) => 
    api.get('/recommendations/by_genre', { params: { genre, limit } }),
};

// Users API
export const usersAPI = {
  getUser: (id) => 
    api.get(`/users/${id}`),
  
  getUsers: (params = {}) => 
    api.get('/users', { params }),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api; 