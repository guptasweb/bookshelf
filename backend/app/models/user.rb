class User < ApplicationRecord
  has_secure_password
  
  # Associations
  has_many :reviews, dependent: :destroy
  has_many :reading_lists, dependent: :destroy
  has_many :reading_list_items, through: :reading_lists
  
  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }
  validates :password, length: { minimum: 6 }, allow_nil: true
  
  # Scopes
  scope :active, -> { where(active: true) }
  
  # Instance methods
  def full_name
    name
  end
  
  def reviewed_books
    Book.joins(:reviews).where(reviews: { user: self })
  end
  
  def average_rating
    reviews.average(:rating) || 0
  end
  
  def to_jwt_payload
    {
      user_id: id,
      email: email,
      name: name
    }
  end
end 