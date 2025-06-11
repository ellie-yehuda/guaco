import { createContext, useContext, useState, ReactNode } from 'react';

export interface Recipe {
  id: string;
  title: string;
  summary: string;
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
    setIsLoading(true);
    // Placeholder for API call or data fetching logic
    console.log(`Fetching recipes for category: ${categoryId}`);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setRecipes(prev => ({
      ...prev,
      [categoryId]: [
        { id: '1', title: 'Spicy Tofu Stir-fry', summary: 'Quick and healthy stir-fry with tofu and vegetables.', category: categoryId },
        { id: '2', title: 'Lentil Soup', summary: 'Hearty and nutritious soup, perfect for a cold day.', category: categoryId },
      ],
    }));
    setIsLoading(false);
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