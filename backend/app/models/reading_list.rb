class ReadingList < ApplicationRecord
  # Associations
  belongs_to :user
  has_many :reading_list_items, dependent: :destroy
  has_many :books, through: :reading_list_items
  
  # Validations
  validates :name, presence: true, length: { maximum: 100 }
  validates :name, uniqueness: { scope: :user_id, message: "already exists for this user" }
  
  # Scopes
  scope :public_lists, -> { where(is_public: true) }
  scope :private_lists, -> { where(is_public: false) }
  scope :recent, -> { order(created_at: :desc) }
  
  # Instance methods
  def total_books
    books.count
  end
  
  def add_book(book)
    return false if has_book?(book)
    
    reading_list_items.create(book: book)
  end
  
  def remove_book(book)
    reading_list_items.find_by(book: book)&.destroy
  end
  
  def has_book?(book)
    books.exists?(book.id)
  end
  
  def completion_percentage
    return 0 if total_books.zero?
    
    completed_books = reading_list_items.where(status: 'completed').count
    (completed_books.to_f / total_books * 100).round(2)
  end
end 