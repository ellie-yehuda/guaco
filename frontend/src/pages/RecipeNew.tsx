import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes, RecipeProvider } from '../context/RecipeContext';
import RecipeEditor from '../components/RecipeEditor';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';

const RecipeNewContent = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories, createRecipe, isLoading } = useRecipes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch categories if not already loaded
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const handleSubmit = async (recipe: any) => {
    setIsSubmitting(true);
    try {
      const createdRecipe = await createRecipe(recipe);
      navigate(`/recipes/${createdRecipe._id}`);
    } catch (error) {
      console.error('Error creating recipe:', error);
      setIsSubmitting(false);
    }
  };

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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent">
            Create New Recipe
          </h1>
          <p className="mt-2 text-gray-600">
            Fill out the form below to add a new recipe to your collection.
          </p>
        </div>

        {/* Recipe Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          <RecipeEditor
            onSubmit={handleSubmit}
            categories={categories}
            isLoading={isLoading || isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default function RecipeNew() {
  return (
    <RecipeProvider>
      <RecipeNewContent />
    </RecipeProvider>
  );
}