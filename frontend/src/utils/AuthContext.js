import React, { createContext, useState, useEffect } from 'react';
import ApiService from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  // Function to login user
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.auth.login({ email, password });
      if (response.data && response.data.user) {
        const userData = response.data.user;
        // Store user data in state
        setUserInfo(userData);
        // Store user token in AsyncStorage
        await AsyncStorage.setItem('userToken', userData._id);
        await AsyncStorage.setItem('userInfo', JSON.stringify(userData));
        setUserToken(userData._id);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      console.error('Login error:', error);
    }
    setIsLoading(false);
  };

  // Function to register user
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await ApiService.auth.register(userData);
      if (response.data && response.data.user) {
        const user = response.data.user;
        // After successful registration, automatically log in
        await login(userData.email, userData.password);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      console.error('Registration error:', error);
    }
    setIsLoading(false);
  };

  // Function to logout user
  const logout = async () => {
    setIsLoading(true);
    // Remove user data from AsyncStorage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setUserToken(null);
    setUserInfo(null);
    setIsLoading(false);
  };

  // Check if user is already logged in
  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      // Get stored token and user info
      const userToken = await AsyncStorage.getItem('userToken');
      const userInfo = await AsyncStorage.getItem('userInfo');
      
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo));
        setUserToken(userToken);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('isLoggedIn error:', error);
      setIsLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        login, 
        logout, 
        register, 
        isLoading, 
        userToken,
        setUserToken,
        userInfo,
        setUserInfo,
        error
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 