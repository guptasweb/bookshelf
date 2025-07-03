class Api::V1::ReadingListsController < ApplicationController
  before_action :set_reading_list, only: [:show, :update, :destroy, :add_book, :remove_book]
  before_action :set_user, only: [:index, :create]
  skip_before_action :authenticate_user!, only: [:index, :show]
  
  def index
    reading_lists = @user.reading_lists.includes(:books)
    
    # Only show public lists if not the owner
    unless @user == current_user
      reading_lists = reading_lists.public_lists
    end
    
    reading_lists = reading_lists.recent
    reading_lists = paginate_collection(reading_lists)
    
    paginated_response(reading_lists, ReadingListSerializer)
  end
  
  def show
    # Check privacy
    if !@reading_list.is_public? && @reading_list.user != current_user
      return error_response('This reading list is private', nil, :forbidden)
    end
    
    success_response(
      ReadingListSerializer.new(@reading_list, include: [:books]).serializable_hash[:data][:attributes]
    )
  end
  
  def create
    # Only allow users to create their own reading lists
    unless @user == current_user
      return error_response('You can only create your own reading lists', nil, :forbidden)
    end
    
    reading_list = @user.reading_lists.build(reading_list_params)
    
    if reading_list.save
      success_response(
        ReadingListSerializer.new(reading_list).serializable_hash[:data][:attributes],
        'Reading list created successfully',
        :created
      )
    else
      error_response('Reading list creation failed', reading_list.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def update
    # Only allow owner to update
    unless @reading_list.user == current_user
      return error_response('You can only update your own reading lists', nil, :forbidden)
    end
    
    if @reading_list.update(reading_list_params)
      success_response(
        ReadingListSerializer.new(@reading_list).serializable_hash[:data][:attributes],
        'Reading list updated successfully'
      )
    else
      error_response('Reading list update failed', @reading_list.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def destroy
    # Only allow owner to delete
    unless @reading_list.user == current_user
      return error_response('You can only delete your own reading lists', nil, :forbidden)
    end
    
    @reading_list.destroy
    success_response(nil, 'Reading list deleted successfully')
  end
  
  # Add a book to the reading list
  def add_book
    # Only allow owner to modify
    unless @reading_list.user == current_user
      return error_response('You can only modify your own reading lists', nil, :forbidden)
    end
    
    book = Book.find(params[:book_id])
    
    if @reading_list.has_book?(book)
      return error_response('Book is already in this reading list', nil, :conflict)
    end
    
    reading_list_item = @reading_list.reading_list_items.build(
      book: book,
      status: params[:status] || 'want_to_read',
      notes: params[:notes]
    )
    
    if reading_list_item.save
      # Update books count
      @reading_list.update!(books_count: @reading_list.books.count)
      
      success_response(
        ReadingListItemSerializer.new(reading_list_item).serializable_hash[:data][:attributes],
        'Book added to reading list'
      )
    else
      error_response('Failed to add book to reading list', reading_list_item.errors.full_messages, :unprocessable_entity)
    end
  end
  
  # Remove a book from the reading list
  def remove_book
    # Only allow owner to modify
    unless @reading_list.user == current_user
      return error_response('You can only modify your own reading lists', nil, :forbidden)
    end
    
    book = Book.find(params[:book_id])
    reading_list_item = @reading_list.reading_list_items.find_by(book: book)
    
    if reading_list_item
      reading_list_item.destroy
      
      # Update books count
      @reading_list.update!(books_count: @reading_list.books.count)
      
      success_response(nil, 'Book removed from reading list')
    else
      error_response('Book not found in this reading list', nil, :not_found)
    end
  end
  
  # Update reading progress
  def update_progress
    # Only allow owner to modify
    unless @reading_list.user == current_user
      return error_response('You can only modify your own reading lists', nil, :forbidden)
    end
    
    book = Book.find(params[:book_id])
    reading_list_item = @reading_list.reading_list_items.find_by(book: book)
    
    if reading_list_item
      if reading_list_item.update(progress_params)
        success_response(
          ReadingListItemSerializer.new(reading_list_item).serializable_hash[:data][:attributes],
          'Reading progress updated'
        )
      else
        error_response('Failed to update progress', reading_list_item.errors.full_messages, :unprocessable_entity)
      end
    else
      error_response('Book not found in this reading list', nil, :not_found)
    end
  end
  
  private
  
  def set_user
    @user = User.find(params[:user_id])
  end
  
  def set_reading_list
    @reading_list = ReadingList.find(params[:id])
  end
  
  def reading_list_params
    params.require(:reading_list).permit(:name, :description, :is_public)
  end
  
  def progress_params
    params.require(:reading_list_item).permit(:status, :current_page, :notes)
  end
end 