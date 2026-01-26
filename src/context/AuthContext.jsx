import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { customerAPI } from '../api';

const AuthContext = createContext();

// ---------------- REDUCER ----------------
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

// ---------------- INITIAL STATE ----------------
const tokenFromStorage = localStorage.getItem('token');

const initialState = {
  user: null,
  token: tokenFromStorage,
  isAuthenticated: !!tokenFromStorage, // ✅ KEY FIX
  loading: false,
  error: null,
};

// ---------------- PROVIDER ----------------
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔥 Restore session on app load (SSO FIX)
  useEffect(() => {
    if (state.token) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: null, // optional: lazy load profile later
          token: state.token,
        },
      });
    }
  }, []);

  // ---------------- LOGIN ----------------
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });

      const response = await customerAPI.login(credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });

      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  // ---------------- REGISTER ----------------
  const register = async (data) => {
    try {
      await customerAPI.register(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // ---------------- OAUTH2 LOGIN ----------------
  const loginWithOAuth2 = async (token) => {
    try {
      if (!token) {
        throw new Error('No token provided');
      }

      localStorage.setItem('token', token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: null, token },
      });

      return { success: true };
    } catch (error) {
      const message = error.message || 'OAuth2 login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      return { success: false, error: message };
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        loginWithOAuth2,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
