import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes, RecipeProvider } from '../context/RecipeContext';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Recipe } from '../types/Recipe';

const RecipeDetailContent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipe } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const fetchedRecipe = await getRecipe(id);
        if (fetchedRecipe) {
          setRecipe(fetchedRecipe);
        } else {
          setError('Recipe not found');
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id, getRecipe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-xl mb-4">{error || 'Recipe not found'}</div>
        <Button onClick={() => navigate('/recipes')} className="bg-emerald-500 text-white">
          Back to Recipes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-24 -left-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-teal-400/40 via-green-300/40 to-transparent blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-24 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-purple-400/40 via-fuchsia-300/40 to-transparent blur-3xl opacity-50" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/recipes')}
          variant="ghost"
          className="mb-6 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Recipes
        </Button>

        {/* Recipe Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent">
              {recipe.title}
            </h1>
            <Button
              variant="outline"
              className="text-emerald-700 border-emerald-300"
              onClick={() => navigate(`/recipes/edit/${recipe._id}`)}
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </Button>
          </div>

          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Two-column layout for desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredients - Left column on desktop */}
            <div className="md:col-span-1">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-baseline">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 mt-1.5"></span>
                    <span>
                      {ingredient.amount && (
                        <span className="font-medium text-gray-700">{ingredient.amount} </span>
                      )}
                      {ingredient.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions - Right column on desktop */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps.map((step, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mr-3 mt-0.5 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RecipeDetail() {
  return (
    <RecipeProvider>
      <RecipeDetailContent />
    </RecipeProvider>
  );
}