class Api::V1::RecommendationsController < ApplicationController
  def index
    # Get recommendations based on user's reading history and preferences
    recommendations = generate_recommendations_for_user
    
    success_response(recommendations)
  end
  
  # Get recommendations based on a specific book
  def for_book
    book = Book.find(params[:book_id])
    
    begin
      google_books_service = GoogleBooksService.new
      results = google_books_service.get_recommendations(
        book.title, 
        book.authors_list.first,
        { limit: params[:limit] || 10 }
      )
      
      if results&.dig('items')
        # Import and return recommended books
        books = google_books_service.import_books_from_search(results)
        # Exclude the original book from recommendations
        books = books.reject { |b| b.id == book.id }
        
        success_response({
          books: BookSerializer.new(books).serializable_hash[:data],
          based_on: BookSerializer.new(book).serializable_hash[:data][:attributes]
        })
      else
        success_response({
          books: [],
          based_on: BookSerializer.new(book).serializable_hash[:data][:attributes],
          message: 'No recommendations found'
        })
      end
    rescue => e
      error_response('Failed to generate recommendations', e.message)
    end
  end
  
  # Get recommendations by genre/category
  def by_genre
    genre = params[:genre]
    
    if genre.blank?
      return error_response('Genre parameter is required', nil, :bad_request)
    end
    
    begin
      google_books_service = GoogleBooksService.new
      results = google_books_service.search_by_subject(genre)
      
      if results&.dig('items')
        books = google_books_service.import_books_from_search(results)
        success_response({
          books: BookSerializer.new(books).serializable_hash[:data],
          genre: genre
        })
      else
        success_response({
          books: [],
          genre: genre,
          message: 'No books found for this genre'
        })
      end
    rescue => e
      error_response('Failed to get genre recommendations', e.message)
    end
  end
  
  private
  
  def generate_recommendations_for_user
    # Simple recommendation algorithm based on user's reading history
    user_books = current_user.reviewed_books.includes(:reviews)
    
    if user_books.empty?
      # For new users, return popular books
      return get_popular_books_recommendation
    end
    
    # Get user's favorite genres based on highest rated books
    favorite_genres = get_user_favorite_genres(user_books)
    
    # Get user's favorite authors
    favorite_authors = get_user_favorite_authors(user_books)
    
    recommendations = []
    
    # Add genre-based recommendations
    if favorite_genres.any?
      recommendations += get_books_by_genres(favorite_genres, 5)
    end
    
    # Add author-based recommendations
    if favorite_authors.any?
      recommendations += get_books_by_authors(favorite_authors, 5)
    end
    
    # Add popular books if we don't have enough recommendations
    if recommendations.length < 10
      recommendations += get_popular_books_recommendation(10 - recommendations.length)
    end
    
    # Remove duplicates and books user already reviewed
    reviewed_book_ids = user_books.pluck(:id)
    recommendations = recommendations.uniq.reject { |book| reviewed_book_ids.include?(book.id) }
    
    {
      books: BookSerializer.new(recommendations.first(10)).serializable_hash[:data],
      algorithm: 'Based on your reading history and preferences'
    }
  end
  
  def get_user_favorite_genres(user_books)
    # Get genres from books with rating >= 4
    high_rated_books = user_books.joins(:reviews)
                                 .where(reviews: { user: current_user, rating: 4..5 })
    
    genres = high_rated_books.map(&:categories_list).flatten.compact
    
    # Count genre frequency and return top 3
    genre_counts = genres.each_with_object(Hash.new(0)) { |genre, counts| counts[genre] += 1 }
    genre_counts.sort_by { |_, count| -count }.first(3).map(&:first)
  end
  
  def get_user_favorite_authors(user_books)
    # Get authors from books with rating >= 4
    high_rated_books = user_books.joins(:reviews)
                                 .where(reviews: { user: current_user, rating: 4..5 })
    
    authors = high_rated_books.map(&:authors_list).flatten.compact
    
    # Count author frequency and return top 3
    author_counts = authors.each_with_object(Hash.new(0)) { |author, counts| counts[author] += 1 }
    author_counts.sort_by { |_, count| -count }.first(3).map(&:first)
  end
  
  def get_books_by_genres(genres, limit)
    Book.where("categories ILIKE ANY (ARRAY[?])", genres.map { |g| "%#{g}%" })
        .order(average_rating: :desc)
        .limit(limit)
  end
  
  def get_books_by_authors(authors, limit)
    Book.where("authors ILIKE ANY (ARRAY[?])", authors.map { |a| "%#{a}%" })
        .order(average_rating: :desc)
        .limit(limit)
  end
  
  def get_popular_books_recommendation(limit = 10)
    Book.order(average_rating: :desc, reviews_count: :desc)
        .limit(limit)
  end
end 