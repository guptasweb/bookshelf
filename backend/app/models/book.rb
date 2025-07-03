class Book < ApplicationRecord
  # Associations
  has_many :reviews, dependent: :destroy
  has_many :reading_list_items, dependent: :destroy
  has_many :reading_lists, through: :reading_list_items
  has_many :users, through: :reviews
  
  # Validations
  validates :title, presence: true
  validates :google_books_id, uniqueness: true, allow_nil: true
  validates :isbn_10, uniqueness: true, allow_nil: true
  validates :isbn_13, uniqueness: true, allow_nil: true
  
  # Scopes
  scope :published, -> { where.not(published_date: nil) }
  scope :by_author, ->(author) { where("authors ILIKE ?", "%#{author}%") }
  scope :by_genre, ->(genre) { where("categories ILIKE ?", "%#{genre}%") }
  scope :with_reviews, -> { joins(:reviews).distinct }
  
  # Instance methods
  def average_rating
    reviews.average(:rating) || 0
  end
  
  def total_reviews
    reviews.count
  end
  
  def authors_list
    authors&.split(',')&.map(&:strip) || []
  end
  
  def categories_list
    categories&.split(',')&.map(&:strip) || []
  end
  
  def published_year
    published_date&.year
  end
  
  def cover_image_url(size = 'medium')
    case size
    when 'small'
      small_thumbnail || thumbnail
    when 'large'
      large_thumbnail || thumbnail
    else
      thumbnail
    end
  end
  
  def self.find_or_create_from_google_books(google_books_data)
    book = find_by(google_books_id: google_books_data['id'])
    return book if book.present?
    
    volume_info = google_books_data['volumeInfo'] || {}
    image_links = volume_info['imageLinks'] || {}
    industry_identifiers = volume_info['industryIdentifiers'] || []
    
    isbn_10 = industry_identifiers.find { |id| id['type'] == 'ISBN_10' }&.dig('identifier')
    isbn_13 = industry_identifiers.find { |id| id['type'] == 'ISBN_13' }&.dig('identifier')
    
    create!(
      google_books_id: google_books_data['id'],
      title: volume_info['title'],
      subtitle: volume_info['subtitle'],
      authors: volume_info['authors']&.join(', '),
      publisher: volume_info['publisher'],
      published_date: parse_published_date(volume_info['publishedDate']),
      description: volume_info['description'],
      page_count: volume_info['pageCount'],
      categories: volume_info['categories']&.join(', '),
      language: volume_info['language'],
      isbn_10: isbn_10,
      isbn_13: isbn_13,
      thumbnail: image_links['thumbnail'],
      small_thumbnail: image_links['smallThumbnail'],
      large_thumbnail: image_links['large'],
      preview_link: volume_info['previewLink'],
      info_link: volume_info['infoLink']
    )
  end
  
  private
  
  def self.parse_published_date(date_string)
    return nil if date_string.blank?
    
    # Handle different date formats from Google Books API
    case date_string.length
    when 4 # Year only (e.g., "2020")
      Date.new(date_string.to_i, 1, 1)
    when 7 # Year-Month (e.g., "2020-03")
      Date.parse("#{date_string}-01")
    else # Full date (e.g., "2020-03-15")
      Date.parse(date_string)
    end
  rescue Date::Error
    nil
  end
end 