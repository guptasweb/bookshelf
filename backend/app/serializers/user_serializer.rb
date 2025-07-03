class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :name, :email, :bio, :location, :website, :active, 
             :email_notifications, :last_sign_in_at, :created_at
  
  attribute :avatar_url do |user|
    # Placeholder for avatar URL - could be integrated with image hosting service
    nil
  end
  
  attribute :reviews_count do |user|
    user.reviews.count
  end
  
  attribute :reading_lists_count do |user|
    user.reading_lists.count
  end
  
  attribute :average_rating_given do |user|
    user.average_rating
  end
  
  attribute :member_since do |user|
    user.created_at.strftime("%B %Y")
  end
  
  has_many :reviews
  has_many :reading_lists
end 