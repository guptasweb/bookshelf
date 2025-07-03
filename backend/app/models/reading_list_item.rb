class ReadingListItem < ApplicationRecord
  # Associations
  belongs_to :reading_list
  belongs_to :book
  
  # Validations
  validates :book_id, uniqueness: { scope: :reading_list_id, message: "already exists in this reading list" }
  validates :status, inclusion: { in: %w[want_to_read currently_reading completed] }
  
  # Scopes
  scope :want_to_read, -> { where(status: 'want_to_read') }
  scope :currently_reading, -> { where(status: 'currently_reading') }
  scope :completed, -> { where(status: 'completed') }
  scope :recent, -> { order(created_at: :desc) }
  
  # Instance methods
  def status_display
    status.humanize
  end
  
  def days_since_added
    (Date.current - created_at.to_date).to_i
  end
  
  def mark_as_completed!
    update!(status: 'completed', completed_at: Time.current)
  end
  
  def mark_as_currently_reading!
    update!(status: 'currently_reading', started_at: Time.current)
  end
  
  def reading_progress_percentage
    return 0 unless book.page_count && current_page
    
    (current_page.to_f / book.page_count * 100).round(2)
  end
end 