class Api::V1::ReviewsController < ApplicationController
  before_action :set_book
  before_action :set_review, only: [:show, :update, :destroy]
  skip_before_action :authenticate_user!, only: [:index, :show]
  
  def index
    reviews = @book.reviews.includes(:user).recent
    
    # Apply filters
    reviews = reviews.by_rating(params[:rating]) if params[:rating].present?
    reviews = reviews.with_content if params[:with_content] == 'true'
    
    reviews = paginate_collection(reviews)
    paginated_response(reviews, ReviewSerializer)
  end
  
  def show
    success_response(
      ReviewSerializer.new(@review, include: [:user, :book]).serializable_hash[:data][:attributes]
    )
  end
  
  def create
    # Check if user already reviewed this book
    existing_review = @book.reviews.find_by(user: current_user)
    if existing_review
      return error_response('You have already reviewed this book', nil, :conflict)
    end
    
    review = @book.reviews.build(review_params)
    review.user = current_user
    
    if review.save
      # Update book's average rating and review count
      update_book_stats
      
      success_response(
        ReviewSerializer.new(review).serializable_hash[:data][:attributes],
        'Review created successfully',
        :created
      )
    else
      error_response('Review creation failed', review.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def update
    # Only allow user to update their own review
    unless @review.user == current_user
      return error_response('You can only update your own reviews', nil, :forbidden)
    end
    
    if @review.update(review_params)
      # Update book's average rating
      update_book_stats
      
      success_response(
        ReviewSerializer.new(@review).serializable_hash[:data][:attributes],
        'Review updated successfully'
      )
    else
      error_response('Review update failed', @review.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def destroy
    # Only allow user to delete their own review or admin
    unless @review.user == current_user
      return error_response('You can only delete your own reviews', nil, :forbidden)
    end
    
    @review.destroy
    
    # Update book's average rating and review count
    update_book_stats
    
    success_response(nil, 'Review deleted successfully')
  end
  
  # Mark review as helpful
  def mark_helpful
    review = @book.reviews.find(params[:review_id])
    review.increment!(:helpful_count)
    
    success_response(
      { helpful_count: review.helpful_count },
      'Review marked as helpful'
    )
  end
  
  private
  
  def set_book
    @book = Book.find(params[:book_id])
  end
  
  def set_review
    @review = @book.reviews.find(params[:id])
  end
  
  def review_params
    params.require(:review).permit(:rating, :content, :spoiler_alert)
  end
  
  def update_book_stats
    @book.update!(
      average_rating: @book.reviews.average(:rating) || 0,
      reviews_count: @book.reviews.count
    )
  end
end 