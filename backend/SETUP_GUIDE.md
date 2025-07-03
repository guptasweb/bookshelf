# Bookshelf Backend Setup Guide

This guide will help you set up the Rails API backend with Google Books integration.

## Prerequisites

Before you begin, make sure you have the following installed:

### 1. Ruby (Version 3.0+)
**Windows:**
- Download from [RubyInstaller](https://rubyinstaller.org/) 
- Choose Ruby+Devkit version for gem compilation
- During installation, make sure to install MSYS2 development toolchain

### 2. Rails
```bash
gem install rails -v "~> 7.0.0"
```

### 3. PostgreSQL
- Download from [postgresql.org](https://www.postgresql.org/downloads/)
- Remember your postgres user password during installation

### 4. Bundler
```bash
gem install bundler
```

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
bundle install
```

### Step 2: Environment Configuration
1. Copy the environment template:
```bash
copy env.example .env
```

2. Edit `.env` file with your configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost/bookshelf_development
DATABASE_HOST=localhost
DATABASE_NAME=bookshelf_development
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_postgres_password

# Google Books API Configuration
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRATION=24h

# Application Settings
RAILS_ENV=development
PORT=3000

# CORS Settings
FRONTEND_URL=http://localhost:3001
```

### Step 3: Get Google Books API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Books API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key to your `.env` file

### Step 4: Database Setup
```bash
# Create databases
rails db:create

# Run migrations
rails db:migrate

# Optional: Seed with sample data
rails db:seed
```

### Step 5: Start the Server
```bash
rails server
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `DELETE /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/profile` - Get user profile
- `PUT /api/v1/auth/profile` - Update user profile

### Books
- `GET /api/v1/books` - List books
- `GET /api/v1/books/:id` - Get specific book
- `GET /api/v1/books/search?q=query` - Search books (Google Books API)
- `POST /api/v1/books/import` - Import book from Google Books
- `GET /api/v1/books/popular` - Get popular books
- `GET /api/v1/books/new_releases` - Get new releases

### Reviews
- `GET /api/v1/books/:book_id/reviews` - Get book reviews
- `POST /api/v1/books/:book_id/reviews` - Create review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

### Reading Lists
- `GET /api/v1/users/:user_id/reading_lists` - Get user's reading lists
- `POST /api/v1/users/:user_id/reading_lists` - Create reading list
- `POST /api/v1/reading_lists/:id/add_book` - Add book to list
- `DELETE /api/v1/reading_lists/:id/remove_book` - Remove book from list

### Recommendations
- `GET /api/v1/recommendations` - Get personalized recommendations
- `GET /api/v1/recommendations/for_book/:book_id` - Get book-based recommendations
- `GET /api/v1/recommendations/by_genre?genre=fiction` - Get genre recommendations

## Testing the API

### 1. Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### 2. Search Books
```bash
curl "http://localhost:3000/api/v1/books/search?q=harry+potter"
```

### 3. Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
  }'
```

## Troubleshooting

### Common Issues:

1. **Bundle install fails with gem compilation errors:**
   - Make sure you have Ruby DevKit installed
   - Install Visual Studio Build Tools if on Windows

2. **Database connection errors:**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists: `rails db:create`

3. **Google Books API errors:**
   - Verify API key is correct
   - Check if Books API is enabled in Google Cloud Console
   - Ensure you haven't exceeded API quotas

4. **CORS errors from frontend:**
   - Verify `FRONTEND_URL` in `.env` matches your frontend URL
   - Check CORS configuration in `config/application.rb`

## Development Tips

### Useful Rails Commands:
```bash
# Check routes
rails routes

# Rails console for debugging
rails console

# Run tests
rspec

# Check database status
rails db:version

# Reset database (CAUTION: destroys all data)
rails db:drop db:create db:migrate
```

### Database Management:
```bash
# Create migration
rails generate migration MigrationName

# Rollback last migration
rails db:rollback

# View migration status
rails db:migrate:status
```

## Next Steps

1. Set up the frontend React application
2. Configure authentication flow between frontend and backend
3. Implement additional features like user avatars, book ratings, etc.
4. Set up background jobs for API data synchronization
5. Implement caching for better performance

## Support

If you encounter issues:
1. Check the Rails logs: `tail -f log/development.log`
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that PostgreSQL service is running 