class BookSerializer
  include JSONAPI::Serializer
  
  attributes :id, :google_books_id, :title, :subtitle, :authors, :publisher, 
             :published_date, :description, :page_count, :categories, :language,
             :isbn_10, :isbn_13, :thumbnail, :small_thumbnail, :large_thumbnail,
             :preview_link, :info_link, :average_rating, :reviews_count, :featured
  
  attribute :authors_list do |book|
    book.authors_list
  end
  
  attribute :categories_list do |book|
    book.categories_list
  end
  
  attribute :published_year do |book|
    book.published_year
  end
  
  attribute :cover_image do |book|
    {
      small: book.cover_image_url('small'),
      medium: book.cover_image_url('medium'),
      large: book.cover_image_url('large')
    }
  end
  
  attribute :rating_breakdown do |book|
    if book.reviews.any?
      {
        5 => book.reviews.where(rating: 5).count,
        4 => book.reviews.where(rating: 4).count,
        3 => book.reviews.where(rating: 3).count,
        2 => book.reviews.where(rating: 2).count,
        1 => book.reviews.where(rating: 1).count
      }
    else
      { 5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0 }
    end
  end
  
  attribute :description_excerpt do |book|
    if book.description.present?
      truncated = book.description.truncate(200)
      truncated == book.description ? truncated : "#{truncated}..."
    end
  end
  
  has_many :reviews
  has_many :reading_lists, through: :reading_list_items
end 