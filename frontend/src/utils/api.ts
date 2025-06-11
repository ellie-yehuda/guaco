// API service for handling backend requests
// @ts-nocheck
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * API client for making requests to the backend
 */
export const api = {
  /**
   * Base fetch function with error handling
   */
  async fetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `API error: ${response.status} ${response.statusText}`
        );
      }
      
      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return {} as T;
    } catch (error: any) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  
  /**
   * GET request
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, { headers });
  },
  
  /**
   * POST request
   */
  async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: data,
      headers,
    });
  },
  
  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers,
    });
  },
  
  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'DELETE',
      headers,
    });
  },
  
  // Recipe specific API calls
  recipes: {
    /**
     * Generate a recipe from ingredients
     */
    generateFromIngredients: async (ingredients: string[]) => {
      return api.post<any>('/api/generate_recipe_from_ingredients', { ingredients });
    },
    
    /**
     * Get recipes by category
     */
    getByCategory: async (category: string) => {
      return api.get<any[]>(`/api/recipes/${category}`);
    },
    
    /**
     * Save a recipe
     */
    save: async (recipeData: any) => {
      return api.post<any>('/api/recipes', recipeData);
    },
  },
};

export default api; 