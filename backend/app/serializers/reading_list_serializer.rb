class ReadingListSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :description, :is_public, :books_count, :created_at, :updated_at
  
  attribute :owner_name do |reading_list|
    reading_list.user.name
  end
  
  attribute :owner_id do |reading_list|
    reading_list.user.id
  end
  
  attribute :total_books do |reading_list|
    reading_list.total_books
  end
  
  attribute :completion_percentage do |reading_list|
    reading_list.completion_percentage
  end
  
  attribute :privacy_status do |reading_list|
    reading_list.is_public? ? 'Public' : 'Private'
  end
  
  attribute :recent_books do |reading_list|
    # Get the 3 most recently added books
    recent_books = reading_list.books.joins(:reading_list_items)
                               .order('reading_list_items.created_at DESC')
                               .limit(3)
    
    BookSerializer.new(recent_books).serializable_hash[:data]
  end
  
  attribute :reading_stats do |reading_list|
    items = reading_list.reading_list_items
    {
      want_to_read: items.want_to_read.count,
      currently_reading: items.currently_reading.count,
      completed: items.completed.count
    }
  end
  
  belongs_to :user
  has_many :books, through: :reading_list_items
  has_many :reading_list_items
end 