import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch({ type: 'SET_TOKEN', payload: token });
      // Verify token and get user profile
      getCurrentUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.data });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      console.error('Get user error:', error);
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        return { success: true, user };
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await authAPI.register(name, email, password);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'SET_TOKEN', payload: token });
        dispatch({ type: 'SET_USER', payload: user });
        return { success: true, user };
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateProfile = async (profileData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.data });
        return { success: true, user: response.data.data };
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Profile update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    getCurrentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 