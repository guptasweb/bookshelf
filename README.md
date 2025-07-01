# Bookshelf - Book Review App

A full-stack book review application with Ruby on Rails backend and React frontend.

## Features

- 📚 **Book Database**: Comprehensive book catalog with Google Books API integration
- ⭐ **User Reviews & Ratings**: Users can rate and review books
- 📖 **Reading Lists**: Personal reading lists and wishlist management
- 🎯 **Recommendations**: Personalized book recommendations
- 👤 **User Management**: User authentication and profiles

## Tech Stack

### Backend
- **Ruby on Rails** (API mode)
- **PostgreSQL** database
- **Google Books API** integration
- **JWT** authentication

### Frontend
- **React** with modern hooks
- **Axios** for API calls
- **React Router** for navigation
- **Tailwind CSS** for styling

## Project Structure

```
bookshelf/
├── backend/          # Rails API backend
├── frontend/         # React frontend
├── docs/            # Documentation
└── README.md        # This file
```

## Prerequisites

Before setting up the project, make sure you have the following installed:

### For Backend (Rails)
1. **Ruby** (version 3.0+)
   - Windows: Download from [ruby-lang.org](https://www.ruby-lang.org/en/downloads/) or use [RubyInstaller](https://rubyinstaller.org/)
   - Install with DevKit for gem compilation

2. **Rails** 
   ```bash
   gem install rails
   ```

3. **PostgreSQL**
   - Download from [postgresql.org](https://www.postgresql.org/downloads/)

### For Frontend (React)
1. **Node.js** (version 16+)
   - Download from [nodejs.org](https://nodejs.org/)
   - This includes npm

2. **Create React App**
   ```bash
   npm install -g create-react-app
   ```

## Setup Instructions

### 1. Backend Setup (Rails API)

```bash
# Navigate to project root
cd bookshelf

# Create Rails API backend
rails new backend --api --database=postgresql --skip-git

# Navigate to backend
cd backend

# Install dependencies
bundle install

# Setup database
rails db:create
rails db:migrate

# Start Rails server (runs on http://localhost:3000)
rails server
```

### 2. Frontend Setup (React)

```bash
# From project root
cd bookshelf

# Create React frontend
npx create-react-app frontend

# Navigate to frontend
cd frontend

# Install additional dependencies
npm install axios react-router-dom

# Start React development server (runs on http://localhost:3001)
npm start
```

### 3. Environment Variables

Create `.env` files in both backend and frontend directories:

**backend/.env**
```
DATABASE_URL=postgresql://username:password@localhost/bookshelf_development
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
JWT_SECRET=your_jwt_secret
```

**frontend/.env**
```
REACT_APP_API_URL=http://localhost:3000
REACT_APP_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
```

## API Endpoints (Planned)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get specific book
- `POST /api/books` - Create new book
- `GET /api/books/search` - Search books (Google Books API)

### Reviews
- `GET /api/books/:id/reviews` - Get book reviews
- `POST /api/books/:id/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Reading Lists
- `GET /api/users/:id/reading_lists` - Get user's reading lists
- `POST /api/reading_lists` - Create reading list
- `POST /api/reading_lists/:id/books` - Add book to list
- `DELETE /api/reading_lists/:id/books/:book_id` - Remove book from list

### Recommendations
- `GET /api/users/:id/recommendations` - Get personalized recommendations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 