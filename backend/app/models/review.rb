class Review < ApplicationRecord
  # Associations
  belongs_to :user
  belongs_to :book
  
  # Validations
  validates :rating, presence: true, inclusion: { in: 1..5 }
  validates :user_id, uniqueness: { scope: :book_id, message: "can only review a book once" }
  validates :content, length: { maximum: 2000 }
  
  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :by_rating, ->(rating) { where(rating: rating) }
  scope :with_content, -> { where.not(content: [nil, '']) }
  
  # Instance methods
  def helpful_votes
    helpful_count || 0
  end
  
  def reviewer_name
    user.name
  end
  
  def formatted_date
    created_at.strftime("%B %d, %Y")
  end
  
  def rating_stars
    "★" * rating + "☆" * (5 - rating)
  end
end 