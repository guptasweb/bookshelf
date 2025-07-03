class Api::V1::AuthController < ApplicationController
  skip_before_action :authenticate_user!, only: [:register, :login]
  
  def register
    user = User.new(registration_params)
    
    if user.save
      token = generate_jwt_token(user)
      success_response(
        {
          user: UserSerializer.new(user).serializable_hash[:data][:attributes],
          token: token
        },
        'Registration successful',
        :created
      )
    else
      error_response('Registration failed', user.errors.full_messages, :unprocessable_entity)
    end
  end
  
  def login
    user = User.find_by(email: login_params[:email])
    
    if user&.authenticate(login_params[:password])
      if user.active?
        user.update(last_sign_in_at: Time.current)
        token = generate_jwt_token(user)
        
        success_response(
          {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          },
          'Login successful'
        )
      else
        error_response('Account is deactivated', nil, :forbidden)
      end
    else
      error_response('Invalid email or password', nil, :unauthorized)
    end
  end
  
  def logout
    # For JWT, logout is typically handled client-side by removing the token
    # But we can update last_sign_in_at to track activity
    current_user.update(last_sign_in_at: Time.current) if current_user
    success_response(nil, 'Logged out successfully')
  end
  
  def profile
    success_response(
      UserSerializer.new(current_user).serializable_hash[:data][:attributes]
    )
  end
  
  def update_profile
    if current_user.update(profile_params)
      success_response(
        UserSerializer.new(current_user).serializable_hash[:data][:attributes],
        'Profile updated successfully'
      )
    else
      error_response('Profile update failed', current_user.errors.full_messages, :unprocessable_entity)
    end
  end
  
  private
  
  def registration_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
  
  def login_params
    params.require(:user).permit(:email, :password)
  end
  
  def profile_params
    params.require(:user).permit(:name, :bio, :location, :website, :email_notifications)
  end
  
  def generate_jwt_token(user)
    payload = user.to_jwt_payload.merge(
      exp: (Time.current + ENV.fetch('JWT_EXPIRATION', '24h').to_i.hours).to_i
    )
    
    JWT.encode(payload, ENV['JWT_SECRET'], 'HS256')
  end
end 