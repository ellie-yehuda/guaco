import { createContext, useContext, useState, ReactNode } from 'react';
import { Recipe as RecipeType } from '../types/Recipe';
import { recipesApi } from '../utils/recipesApi';

export interface Recipe {
  id: string;
  title: string;
  summary?: string;
  category: string;
}

interface RecipeContextType {
  recipes: { [key: string]: Recipe[] };
  isLoading: boolean;
  fetchRecipes: (categoryId: string) => Promise<void>;
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

  const value = {
    recipes,
    isLoading,
    fetchRecipes,
  };

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  );
}; 