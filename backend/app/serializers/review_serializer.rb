class ReviewSerializer
  include JSONAPI::Serializer
  
  attributes :id, :rating, :content, :helpful_count, :spoiler_alert, 
             :featured, :created_at, :updated_at
  
  attribute :reviewer_name do |review|
    review.reviewer_name
  end
  
  attribute :reviewer_id do |review|
    review.user.id
  end
  
  attribute :book_title do |review|
    review.book.title
  end
  
  attribute :book_id do |review|
    review.book.id
  end
  
  attribute :formatted_date do |review|
    review.formatted_date
  end
  
  attribute :rating_stars do |review|
    review.rating_stars
  end
  
  attribute :helpful_votes do |review|
    review.helpful_votes
  end
  
  attribute :content_excerpt do |review|
    if review.content.present?
      review.content.truncate(150)
    end
  end
  
  attribute :has_content do |review|
    review.content.present?
  end
  
  belongs_to :user
  belongs_to :book
end 