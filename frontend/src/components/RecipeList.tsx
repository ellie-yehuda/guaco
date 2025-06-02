import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRecipes, Recipe } from '@/context/RecipeContext';

interface RecipeListProps {
  categoryId: string;
}

const RecipeList = ({ categoryId }: RecipeListProps) => {
  const { recipes, isLoading } = useRecipes();
  const categoryRecipes: Recipe[] = recipes[categoryId] || [];

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Loading recipes...</div>;
  }

  if (categoryRecipes.length === 0) {
    return <div className="text-center py-8 text-gray-600">No recipes found for this category.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categoryRecipes.map((recipe: Recipe) => (
        <Card key={recipe.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-emerald-800">{recipe.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-700">{recipe.summary}</p>
            <Button variant="outline" className="w-full text-emerald-700 border-emerald-300 hover:bg-emerald-50">
              Expand
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecipeList; 