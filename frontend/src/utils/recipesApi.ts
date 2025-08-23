import { Recipe, Category, Ingredient, Nutrition } from '../types/Recipe';

// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// LocalStorage keys
const STORAGE_CATEGORIES_KEY = 'guaco_recipe_categories';
const STORAGE_RECIPES_KEY = 'guaco_recipes';

// Interface for repository implementations
interface RecipesRepository {
  listCategories(): Promise<Category[]>;
  createCategory(category: Omit<Category, '_id' | 'id'>): Promise<Category>;
  createRecipe(recipe: Omit<Recipe, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe>;
  listRecipesByCategory(categoryId: string): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  updateRecipe(id: string, recipe: Omit<Recipe, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe>;
  deleteRecipe(id: string): Promise<boolean>;
}

/**
 * API implementation that calls the backend
 */
class ApiRecipesRepository implements RecipesRepository {
  async listCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async createCategory(category: Omit<Category, '_id' | 'id'>): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create category: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  async createRecipe(recipe: Omit<Recipe, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create recipe: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  async listRecipesByCategory(categoryId: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes?categoryId=${categoryId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      throw error;
    }
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      throw error;
    }
  }

  async updateRecipe(id: string, recipe: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update recipe: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating recipe ${id}:`, error);
      throw error;
    }
  }

  async deleteRecipe(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipes/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (error) {
      console.error(`Error deleting recipe ${id}:`, error);
      throw error;
    }
  }
}

/**
 * LocalStorage implementation for offline development
 */
class LocalStorageRecipesRepository implements RecipesRepository {
  private getCategories(): Category[] {
    const stored = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveCategories(categories: Category[]): void {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }

  private getRecipes(): Recipe[] {
    const stored = localStorage.getItem(STORAGE_RECIPES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveRecipes(recipes: Recipe[]): void {
    localStorage.setItem(STORAGE_RECIPES_KEY, JSON.stringify(recipes));
  }

  async listCategories(): Promise<Category[]> {
    return this.getCategories();
  }

  async createCategory(category: Omit<Category, '_id' | 'id'>): Promise<Category> {
    const categories = this.getCategories();
    
    // Check if category with this slug already exists
    const existingCategory = categories.find(c => c.slug === category.slug);
    if (existingCategory) {
      return existingCategory;
    }
    
    // Create new category
    const newCategory: Category = {
      ...category,
      _id: crypto.randomUUID()
    };
    
    categories.push(newCategory);
    this.saveCategories(categories);
    
    return newCategory;
  }

  async createRecipe(recipe: Omit<Recipe, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const recipes = this.getRecipes();
    const now = new Date().toISOString();
    
    const newRecipe: Recipe = {
      ...recipe,
      _id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    
    recipes.push(newRecipe);
    this.saveRecipes(recipes);
    
    return newRecipe;
  }

  async listRecipesByCategory(categoryId: string): Promise<Recipe[]> {
    const recipes = this.getRecipes();
    return recipes.filter(recipe => recipe.categoryId === categoryId);
  }

  async getRecipe(id: string): Promise<Recipe | null> {
    const recipes = this.getRecipes();
    const recipe = recipes.find(r => r._id === id);
    return recipe || null;
  }

  async updateRecipe(id: string, recipe: Omit<Recipe, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const recipes = this.getRecipes();
    const index = recipes.findIndex(r => r._id === id);
    
    if (index === -1) {
      throw new Error(`Recipe with ID ${id} not found`);
    }
    
    const existingRecipe = recipes[index];
    const updatedRecipe: Recipe = {
      ...recipe,
      _id: id,
      createdAt: existingRecipe.createdAt,
      updatedAt: new Date().toISOString()
    };
    
    recipes[index] = updatedRecipe;
    this.saveRecipes(recipes);
    
    return updatedRecipe;
  }

  async deleteRecipe(id: string): Promise<boolean> {
    const recipes = this.getRecipes();
    const filteredRecipes = recipes.filter(r => r._id !== id);
    
    if (filteredRecipes.length === recipes.length) {
      return false;
    }
    
    this.saveRecipes(filteredRecipes);
    return true;
  }
}

/**
 * Factory function to get the appropriate repository implementation
 */
function createRecipesRepository(): RecipesRepository {
  // Try to connect to the API first
  const repository = new ApiRecipesRepository();
  
  // Test the API connection
  return new Proxy(repository, {
    get: (target, prop) => {
      const method = target[prop as keyof RecipesRepository];
      
      if (typeof method === 'function') {
        return async (...args: any[]) => {
          try {
            // Try to use the API implementation
            return await method.apply(target, args);
          } catch (error) {
            console.warn(`API request failed for ${String(prop)}, falling back to localStorage`, error);
            
            // Fall back to localStorage implementation
            const localRepository = new LocalStorageRecipesRepository();
            const localMethod = localRepository[prop as keyof RecipesRepository];
            
            if (typeof localMethod === 'function') {
              return localMethod.apply(localRepository, args);
            }
          }
        };
      }
      
      return method;
    }
  });
}

// Export the repository instance
export const recipesApi = createRecipesRepository();