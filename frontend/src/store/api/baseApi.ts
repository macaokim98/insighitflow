import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { mockApiResponse } from './mockApi';

const isProduction = import.meta.env.PROD;
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

// Mock query function for production demo
const mockQuery = async (args: any, api: any, extraOptions: any) => {
  if (isProduction && (!apiUrl || apiUrl.includes('demo-api'))) {
    console.log('🎭 Using Mock API for demo');
    const url = typeof args === 'string' ? args : args.url;
    const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
    const body = typeof args === 'string' ? undefined : args.body;
    
    try {
      const response = await mockApiResponse(url, method, body);
      if (response.ok) {
        return { data: await response.json() };
      } else {
        return { 
          error: { 
            status: response.status, 
            data: await response.json() 
          } 
        };
      }
    } catch (error) {
      return { 
        error: { 
          status: 500, 
          data: { message: 'Mock API Error' } 
        } 
      };
    }
  }
  
  // Use real API for development or when real backend is available
  return baseQuery(args, api, extraOptions);
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: mockQuery,
  tagTypes: ['Auth', 'Customer', 'Deal', 'Analytics'],
  endpoints: () => ({}),
});