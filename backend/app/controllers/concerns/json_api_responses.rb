module JsonApiResponses
  extend ActiveSupport::Concern
  
  def success_response(data, message = nil, status = :ok)
    response = { success: true }
    response[:message] = message if message
    response[:data] = data if data
    
    render json: response, status: status
  end
  
  def error_response(message, details = nil, status = :bad_request)
    response = { 
      success: false,
      error: message 
    }
    response[:details] = details if details
    
    render json: response, status: status
  end
  
  def paginated_response(collection, serializer_class = nil)
    if collection.respond_to?(:current_page)
      data = serializer_class ? serializer_class.new(collection).serializable_hash : collection
      
      render json: {
        success: true,
        data: data,
        pagination: {
          current_page: collection.current_page,
          per_page: collection.limit_value,
          total_pages: collection.total_pages,
          total_count: collection.total_count
        }
      }
    else
      success_response(collection)
    end
  end
end 