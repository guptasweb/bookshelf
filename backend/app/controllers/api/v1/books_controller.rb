class Api::V1::BooksController < ApplicationController
  before_action :set_book, only: [:show, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index, :show, :search]
  
  def index
    books = Book.includes(:reviews)
    
    # Apply filters
    books = books.by_author(params[:author]) if params[:author].present?
    books = books.by_genre(params[:genre]) if params[:genre].present?
    books = books.published if params[:published_only] == 'true'
    books = books.where('average_rating >= ?', params[:min_rating]) if params[:min_rating].present?
    
    # Apply sorting
    case params[:sort_by]
    when 'rating'
      books = books.order(average_rating: :desc)
    when 'reviews'
      books = books.order(reviews_count: :desc)
    when 'newest'
      books = books.order(published_date: :desc)
    when 'oldest'
      books = books.order(published_date: :asc)
    else
      books = books.order(created_at: :desc)
    end
    
    books = paginate_collection(books)
    paginated_response(books, BookSerializer)
  end
  
  def show
    success_response(
      BookSerializer.new(@book, include: [:reviews]).serializable_hash[:data][:attributes]
    )
  end
  
  def create
    book = Book.new(book_params)
    
    if book.save
      success_response(
        BookSerializer.new(book).serializable_hash[:data][:attributes],
        'Book created successfully',
        :created
      )
    else
      error_response('Book creation failed', book.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def update
    if @book.update(book_params)
      success_response(
        BookSerializer.new(@book).serializable_hash[:data][:attributes],
        'Book updated successfully'
      )
    else
      error_response('Book update failed', @book.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def destroy
    @book.destroy
    success_response(nil, 'Book deleted successfully')
  end
  
  # Search books using Google Books API
  def search
    query = params[:q] || params[:query]
    
    if query.blank?
      return error_response('Search query is required', nil, :bad_request)
    end
    
    begin
      google_books_service = GoogleBooksService.new
      
      # Determine search type
      results = case params[:search_type]
                when 'isbn'
                  google_books_service.search_by_isbn(query)
                when 'author'
                  google_books_service.search_by_author(query)
                when 'title'
                  google_books_service.search_by_title(query)
                when 'subject'
                  google_books_service.search_by_subject(query)
                else
                  google_books_service.search_books(query, search_options)
                end
      
      if results&.dig('items')
        # Import found books to local database
        books = google_books_service.import_books_from_search(results)
        
        success_response({
          books: BookSerializer.new(books).serializable_hash[:data],
          total_results: results['totalItems'] || 0,
          google_books_data: results
        })
      else
        success_response({
          books: [],
          total_results: 0,
          message: 'No books found'
        })
      end
    rescue GoogleBooksService::GoogleBooksError => e
      error_response("Google Books API error: #{e.message}", nil, :service_unavailable)
    rescue => e
      Rails.logger.error "Book search error: #{e.message}"
      error_response('Search failed', e.message, :internal_server_error)
    end
  end
  
  # Import a specific book from Google Books by ID
  def import
    google_books_id = params[:google_books_id]
    
    if google_books_id.blank?
      return error_response('Google Books ID is required', nil, :bad_request)
    end
    
    begin
      google_books_service = GoogleBooksService.new
      book = google_books_service.import_book_by_id(google_books_id)
      
      if book
        success_response(
          BookSerializer.new(book).serializable_hash[:data][:attributes],
          'Book imported successfully',
          :created
        )
      else
        error_response('Failed to import book', nil, :unprocessable_entity)
      end
    rescue GoogleBooksService::GoogleBooksError => e
      error_response("Google Books API error: #{e.message}", nil, :service_unavailable)
    rescue => e
      Rails.logger.error "Book import error: #{e.message}"
      error_response('Import failed', e.message, :internal_server_error)
    end
  end
  
  # Get popular books
  def popular
    begin
      google_books_service = GoogleBooksService.new
      results = google_books_service.get_popular_books(params[:subject], search_options)
      
      if results&.dig('items')
        books = google_books_service.import_books_from_search(results)
        success_response(BookSerializer.new(books).serializable_hash[:data])
      else
        success_response([])
      end
    rescue => e
      error_response('Failed to fetch popular books', e.message)
    end
  end
  
  # Get new releases
  def new_releases
    begin
      google_books_service = GoogleBooksService.new
      results = google_books_service.get_new_releases(search_options)
      
      if results&.dig('items')
        books = google_books_service.import_books_from_search(results)
        success_response(BookSerializer.new(books).serializable_hash[:data])
      else
        success_response([])
      end
    rescue => e
      error_response('Failed to fetch new releases', e.message)
    end
  end
  
  private
  
  def set_book
    @book = Book.find(params[:id])
  end
  
  def book_params
    params.require(:book).permit(:title, :subtitle, :authors, :publisher, :published_date,
                                 :description, :page_count, :categories, :language,
                                 :isbn_10, :isbn_13, :featured)
  end
  
  def search_options
    {
      max_results: [params[:limit]&.to_i || 20, 40].min,
      start_index: params[:start_index]&.to_i || 0,
      language: params[:language],
      order_by: params[:order_by]
    }.compact
  end
end 