class ApplicationController < ActionController::API
  include JsonApiResponses
  
  before_action :authenticate_user!, except: [:index, :show]
  
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from GoogleBooksService::GoogleBooksError, with: :external_api_error
  rescue_from JWT::DecodeError, with: :unauthorized
  
  private
  
  def authenticate_user!
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token.blank?
      render json: { error: 'Token missing' }, status: :unauthorized
      return
    end
    
    begin
      decoded_token = JWT.decode(token, ENV['JWT_SECRET'], true, algorithm: 'HS256')
      user_data = decoded_token[0]
      @current_user = User.find(user_data['user_id'])
    rescue JWT::DecodeError => e
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'User not found' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
  
  def user_signed_in?
    current_user.present?
  end
  
  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end
  
  def unprocessable_entity(exception)
    render json: { 
      error: 'Validation failed',
      details: exception.record.errors.full_messages 
    }, status: :unprocessable_entity
  end
  
  def external_api_error(exception)
    render json: { error: exception.message }, status: :service_unavailable
  end
  
  def unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
  
  def forbidden
    render json: { error: 'Forbidden' }, status: :forbidden
  end
  
  # Pagination helpers
  def pagination_params
    {
      page: params[:page] || 1,
      per_page: [params[:per_page]&.to_i || 20, 100].min
    }
  end
  
  def paginate_collection(collection)
    collection.page(pagination_params[:page])
              .per(pagination_params[:per_page])
  end
end 