Rails.application.routes.draw do
  # API routes
  namespace :api do
    namespace :v1 do
      # Authentication routes
      scope :auth do
        post 'register', to: 'auth#register'
        post 'login', to: 'auth#login'
        delete 'logout', to: 'auth#logout'
        get 'profile', to: 'auth#profile'
        put 'profile', to: 'auth#update_profile'
      end
      
      # Books routes
      resources :books do
        collection do
          get 'search'           # Search books via Google Books API
          post 'import'          # Import book from Google Books by ID
          get 'popular'          # Get popular books
          get 'new_releases'     # Get new releases
        end
        
        # Nested reviews routes
        resources :reviews do
          member do
            post 'mark_helpful'  # Mark review as helpful
          end
        end
      end
      
      # User routes
      resources :users, only: [:show, :index] do
        # Nested reading lists routes
        resources :reading_lists do
          member do
            post 'add_book'        # Add book to reading list
            delete 'remove_book'   # Remove book from reading list
            put 'update_progress'  # Update reading progress
          end
        end
        
        # User's reviews
        resources :reviews, only: [:index, :show]
      end
      
      # Recommendations routes
      scope :recommendations do
        get '/', to: 'recommendations#index'           # Get personalized recommendations
        get 'for_book/:book_id', to: 'recommendations#for_book'  # Get recommendations based on a book
        get 'by_genre', to: 'recommendations#by_genre'  # Get recommendations by genre
      end
      
      # Direct reading list routes (for convenience)
      resources :reading_lists, only: [:show, :update, :destroy] do
        member do
          post 'add_book'
          delete 'remove_book'
          put 'update_progress'
        end
      end
      
      # Direct reviews routes (for convenience)
      resources :reviews, only: [:show, :update, :destroy]
      
      # Health check endpoint
      get 'health', to: proc { [200, {}, ['OK']] }
    end
  end
  
  # Root route
  root to: proc { [200, {}, ['Bookshelf API v1.0']] }
  
  # Catch-all route for undefined endpoints
  match '*path', to: proc { [404, {}, [{ error: 'Endpoint not found' }.to_json]] }, via: :all
end 