import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe as RecipeType, Category } from '../types/Recipe';
import { recipesApi } from '../utils/recipesApi';

export interface Recipe {
  id: string;
  title: string;
  summary?: string;
  category: string;
}

interface RecipeContextType {
  recipes: { [key: string]: Recipe[] };
  categories: Category[];
  isLoading: boolean;
  fetchRecipes: (categoryId: string) => Promise<void>;
  fetchCategories: () => Promise<Category[]>;
  createRecipe: (recipe: Omit<RecipeType, '_id' | 'createdAt' | 'updatedAt'>) => Promise<RecipeType>;
  getRecipe: (id: string) => Promise<RecipeType | null>;
  parseRecipeWithAI: (input: string) => Promise<Omit<RecipeType, '_id' | 'createdAt' | 'updatedAt'> | null>;
}

const RecipeContext = createContext<RecipeContextType | null>(null);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === null) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider = ({ children }: RecipeProviderProps) => {
  const [recipes, setRecipes] = useState<{ [key: string]: Recipe[] }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRecipes = async (categoryId: string) => {
    if (!categoryId) return;
    
    setIsLoading(true);
    try {
      console.log(`Fetching recipes for category: ${categoryId}`);
      
      // First, ensure the category exists
      const category = await recipesApi.createCategory({
        name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
        slug: categoryId
      });
      
      // Fetch recipes for this category
      const categoryRecipes = await recipesApi.listRecipesByCategory(category._id || categoryId);
      
      // Map to our internal Recipe format
      const formattedRecipes = categoryRecipes.map(recipe => ({
        id: recipe._id || '',
        title: recipe.title,
        summary: recipe.steps.length > 0 ? recipe.steps[0] : undefined,
        category: categoryId
      }));
      
      setRecipes(prev => ({
        ...prev,
        [categoryId]: formattedRecipes,
      }));
    } catch (error) {
      console.error(`Error fetching recipes for category ${categoryId}:`, error);
      // Set empty array for this category to avoid showing loading state forever
      setRecipes(prev => ({
        ...prev,
        [categoryId]: [],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await recipesApi.listCategories();
      setCategories(fetchedCategories);
      return fetchedCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  };

  const createRecipe = async (recipe: Omit<RecipeType, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const createdRecipe = await recipesApi.createRecipe(recipe);
      
      // Update local state if we have this category loaded
      if (recipes[recipe.categoryId]) {
        const formattedRecipe: Recipe = {
          id: createdRecipe._id || '',
          title: createdRecipe.title,
          summary: createdRecipe.steps.length > 0 ? createdRecipe.steps[0] : undefined,
          category: recipe.categoryId
        };
        
        setRecipes(prev => ({
          ...prev,
          [recipe.categoryId]: [...(prev[recipe.categoryId] || []), formattedRecipe]
        }));
      }
      
      return createdRecipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  };

  const getRecipe = async (id: string) => {
    try {
      return await recipesApi.getRecipe(id);
    } catch (error) {
      console.error(`Error fetching recipe ${id}:`, error);
      return null;
    }
  };

  const parseRecipeWithAI = async (input: string) => {
    try {
      console.log('Sending recipe text to AI parser:', input.substring(0, 100) + '...');
      
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/ai/parse-recipe`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to parse recipe: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Parsed recipe data:', data);
      return data;
    } catch (error) {
      console.error('Error parsing recipe with AI:', error);
      alert(`Error parsing recipe: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  // Load categories on initial render
  useEffect(() => {
    fetchCategories();
  }, []);

  const value = {
    recipes,
    categories,
    isLoading,
    fetchRecipes,
    fetchCategories,
    createRecipe,
    getRecipe,
    parseRecipeWithAI,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}; 