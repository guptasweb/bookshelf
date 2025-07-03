class GoogleBooksService
  include HTTParty
  
  base_uri 'https://www.googleapis.com/books/v1'
  
  def initialize
    @api_key = ENV['GOOGLE_BOOKS_API_KEY']
    @default_params = {
      key: @api_key,
      printType: 'books',
      projection: 'lite'
    }
  end
  
  # Search for books with various parameters
  def search_books(query, options = {})
    params = build_search_params(query, options)
    
    response = self.class.get('/volumes', query: params)
    handle_response(response)
  end
  
  # Get a specific book by Google Books ID
  def get_book(google_books_id)
    params = @default_params.merge(projection: 'full')
    
    response = self.class.get("/volumes/#{google_books_id}", query: params)
    handle_response(response)
  end
  
  # Search books by ISBN
  def search_by_isbn(isbn)
    search_books("isbn:#{isbn}")
  end
  
  # Search books by author
  def search_by_author(author)
    search_books("inauthor:#{author}")
  end
  
  # Search books by title
  def search_by_title(title)
    search_books("intitle:#{title}")
  end
  
  # Search books by subject/category
  def search_by_subject(subject)
    search_books("subject:#{subject}")
  end
  
  # Get popular books (bestsellers approximation)
  def get_popular_books(subject = nil, options = {})
    query = subject ? "subject:#{subject}" : "fiction"
    options = options.merge(
      orderBy: 'relevance',
      maxResults: options[:limit] || 20
    )
    
    search_books(query, options)
  end
  
  # Get new releases (recent publications)
  def get_new_releases(options = {})
    current_year = Date.current.year
    last_year = current_year - 1
    
    query = "publishedDate:#{last_year}..#{current_year}"
    options = options.merge(
      orderBy: 'newest',
      maxResults: options[:limit] || 20
    )
    
    search_books(query, options)
  end
  
  # Get book recommendations based on a book
  def get_recommendations(book_title, author = nil, options = {})
    # Build a query to find similar books
    query_parts = []
    
    if author.present?
      query_parts << "inauthor:#{author}"
    end
    
    # Extract genre/subject from the book if available
    if book_title.present?
      # Simple approach: search for books with similar words in title
      title_words = book_title.split.select { |word| word.length > 3 }
      query_parts << title_words.first(2).join(' ') if title_words.any?
    end
    
    query = query_parts.join(' ')
    options = options.merge(
      orderBy: 'relevance',
      maxResults: options[:limit] || 10
    )
    
    search_books(query, options)
  end
  
  # Process and create local Book records from Google Books data
  def import_books_from_search(search_results)
    return [] unless search_results&.dig('items')
    
    books = []
    search_results['items'].each do |item|
      begin
        book = Book.find_or_create_from_google_books(item)
        books << book if book.persisted?
      rescue => e
        Rails.logger.error "Failed to import book #{item['id']}: #{e.message}"
      end
    end
    
    books
  end
  
  # Get book details and import to local database
  def import_book_by_id(google_books_id)
    book_data = get_book(google_books_id)
    return nil unless book_data
    
    Book.find_or_create_from_google_books(book_data)
  rescue => e
    Rails.logger.error "Failed to import book #{google_books_id}: #{e.message}"
    nil
  end
  
  private
  
  def build_search_params(query, options)
    params = @default_params.merge(q: query)
    
    # Add optional parameters
    params[:startIndex] = options[:start_index] || 0
    params[:maxResults] = [options[:max_results] || 20, 40].min # Google Books API limit
    params[:orderBy] = options[:order_by] if options[:order_by]
    params[:langRestrict] = options[:language] if options[:language]
    params[:printType] = options[:print_type] if options[:print_type]
    params[:filter] = options[:filter] if options[:filter]
    
    params
  end
  
  def handle_response(response)
    case response.code
    when 200
      response.parsed_response
    when 401
      raise GoogleBooksError, "Invalid API key"
    when 403
      raise GoogleBooksError, "API quota exceeded or forbidden"
    when 404
      nil
    when 429
      raise GoogleBooksError, "Rate limit exceeded"
    else
      raise GoogleBooksError, "Google Books API error: #{response.code} - #{response.message}"
    end
  end
  
  # Custom error class for Google Books API errors
  class GoogleBooksError < StandardError; end
end 