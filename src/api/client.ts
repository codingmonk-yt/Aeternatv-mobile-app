import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG } from '../constants/api';

// Create axios instance with base configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      // const token = getAuthToken(); // Will implement when auth is ready
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log('📡 Full URL:', `${config.baseURL}${config.url}`);
      console.log('🔗 Protocol:', config.baseURL?.startsWith('https') ? 'HTTPS' : 'HTTP');
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error) => {
      console.error('❌ Response Error Details:');
      console.error('Status:', error.response?.status);
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('URL:', error.config?.url);
      console.error('Base URL:', error.config?.baseURL);
      console.error('Full Error:', error);
      
      // Handle common errors
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        console.log('🔐 Unauthorized - redirecting to login');
      } else if (error.response?.status === 403) {
        console.log('🚫 Forbidden - insufficient permissions');
      } else if (error.response?.status >= 500) {
        console.log('🔥 Server Error - please try again later');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        console.log('🌐 Network Error - check internet connection and server availability');
      } else if (error.code === 'ECONNREFUSED') {
        console.log('🔌 Connection Refused - server may be down or URL incorrect');
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// Export the configured client
export const apiClient = createApiClient();

// Generic API request function
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Helper function to build URL with parameters
export const buildUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = endpoint;
  
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};
