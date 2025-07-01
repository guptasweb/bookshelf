# Bookshelf - Project Overview

## Database Schema

### Users
```sql
users:
  - id (primary key)
  - email (unique, not null)
  - username (unique, not null)
  - password_digest (not null)
  - first_name
  - last_name
  - bio (text)
  - avatar_url
  - created_at
  - updated_at
```

### Books
```sql
books:
  - id (primary key)
  - google_books_id (unique)
  - isbn_10
  - isbn_13
  - title (not null)
  - subtitle
  - authors (array/json)
  - description (text)
  - published_date
  - page_count
  - language
  - cover_image_url
  - thumbnail_url
  - categories (array/json)
  - average_rating (decimal)
  - ratings_count (integer)
  - created_at
  - updated_at
```

### Reviews
```sql
reviews:
  - id (primary key)
  - user_id (foreign key)
  - book_id (foreign key)
  - rating (integer, 1-5)
  - title
  - content (text)
  - created_at
  - updated_at
```

### Reading Lists
```sql
reading_lists:
  - id (primary key)
  - user_id (foreign key)
  - name (not null)
  - description
  - is_public (boolean, default false)
  - created_at
  - updated_at
```

### Reading List Items
```sql
reading_list_items:
  - id (primary key)
  - reading_list_id (foreign key)
  - book_id (foreign key)
  - status (enum: 'want_to_read', 'currently_reading', 'read')
  - notes (text)
  - added_at
  - started_reading_at
  - finished_reading_at
```

### User Book Status
```sql
user_book_statuses:
  - id (primary key)
  - user_id (foreign key)
  - book_id (foreign key)
  - status (enum: 'want_to_read', 'currently_reading', 'read')
  - progress (integer, pages read)
  - created_at
  - updated_at
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `DELETE /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

### Books
- `GET /api/v1/books` - List books with pagination
- `GET /api/v1/books/search` - Search books (Google Books API)
- `GET /api/v1/books/:id` - Get specific book
- `POST /api/v1/books` - Create/Import book from Google Books
- `PUT /api/v1/books/:id` - Update book information

### Reviews
- `GET /api/v1/books/:book_id/reviews` - Get book reviews
- `POST /api/v1/books/:book_id/reviews` - Create review
- `GET /api/v1/reviews/:id` - Get specific review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

### User Book Status
- `GET /api/v1/users/:user_id/books` - Get user's book statuses
- `POST /api/v1/users/:user_id/books/:book_id/status` - Update reading status
- `GET /api/v1/users/:user_id/currently-reading` - Get currently reading books

### Reading Lists
- `GET /api/v1/users/:user_id/reading_lists` - Get user's reading lists
- `POST /api/v1/reading_lists` - Create reading list
- `GET /api/v1/reading_lists/:id` - Get specific reading list
- `PUT /api/v1/reading_lists/:id` - Update reading list
- `DELETE /api/v1/reading_lists/:id` - Delete reading list
- `POST /api/v1/reading_lists/:id/books` - Add book to reading list
- `DELETE /api/v1/reading_lists/:id/books/:book_id` - Remove book from list

### Recommendations
- `GET /api/v1/users/:user_id/recommendations` - Get personalized recommendations
- `GET /api/v1/books/:book_id/similar` - Get similar books

## Features Implementation Plan

### Phase 1: Core Features
1. User authentication (JWT)
2. Book database with Google Books API integration
3. Basic book search and display
4. User reviews and ratings

### Phase 2: Reading Management
1. Reading status tracking
2. Reading lists creation and management
3. Reading progress tracking

### Phase 3: Social Features
1. Public reading lists
2. User profiles
3. Follow system (optional)

### Phase 4: Recommendations
1. Basic recommendation algorithm
2. Similar books suggestions
3. Trending books

## Tech Stack Details

### Backend Dependencies
- `rails` - Web framework
- `pg` - PostgreSQL adapter
- `jwt` - Authentication tokens
- `bcrypt` - Password hashing
- `rack-cors` - CORS handling
- `httparty` - HTTP client for Google Books API
- `kaminari` - Pagination
- `ransack` - Search functionality
- `jsonapi-serializer` - API serialization

### Frontend Dependencies
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework

## External APIs

### Google Books API
- Book search
- Book details retrieval
- Book cover images
- Author information

## Development Workflow

1. Set up development environment
2. Create database migrations
3. Implement authentication system
4. Build book search and display
5. Add review functionality
6. Implement reading lists
7. Add recommendation system
8. UI/UX improvements
9. Testing and deployment 