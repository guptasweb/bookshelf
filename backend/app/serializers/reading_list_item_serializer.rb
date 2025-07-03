class ReadingListItemSerializer
  include JSONAPI::Serializer
  
  attributes :id, :status, :current_page, :notes, :started_at, :completed_at, 
             :position, :created_at, :updated_at
  
  attribute :status_display do |item|
    item.status_display
  end
  
  attribute :days_since_added do |item|
    item.days_since_added
  end
  
  attribute :reading_progress_percentage do |item|
    item.reading_progress_percentage
  end
  
  attribute :book_title do |item|
    item.book.title
  end
  
  attribute :book_cover do |item|
    item.book.cover_image_url('medium')
  end
  
  attribute :book_page_count do |item|
    item.book.page_count
  end
  
  attribute :reading_duration do |item|
    if item.started_at && item.completed_at
      duration_days = (item.completed_at.to_date - item.started_at.to_date).to_i
      if duration_days == 0
        "Same day"
      elsif duration_days == 1
        "1 day"
      else
        "#{duration_days} days"
      end
    elsif item.started_at
      days_reading = (Date.current - item.started_at.to_date).to_i
      if days_reading == 0
        "Started today"
      elsif days_reading == 1
        "Reading for 1 day"
      else
        "Reading for #{days_reading} days"
      end
    end
  end
  
  belongs_to :reading_list
  belongs_to :book
end 