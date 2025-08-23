import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes, RecipeProvider } from '../context/RecipeContext';
import RecipeEditor from '../components/RecipeEditor';
import { ArrowLeftIcon, MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Recipe } from '../types/Recipe';

const RecipeAIContent = () => {
  const navigate = useNavigate();
  const { categories, fetchCategories, createRecipe, parseRecipeWithAI } = useRecipes();
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [parsedRecipe, setParsedRecipe] = useState<Partial<Recipe> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch categories if not already loaded
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  const handleParseRecipe = async () => {
    if (!userInput.trim()) {
      setError('Please enter a recipe description or paste a recipe.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const result = await parseRecipeWithAI(userInput);
      if (result) {
        setParsedRecipe(result);
      } else {
        setError('Failed to parse recipe. Please try again or use the manual form.');
      }
    } catch (err) {
      console.error('Error parsing recipe:', err);
      setError('An error occurred while processing your recipe. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleBack = () => {
    if (parsedRecipe) {
      // Go back to input mode
      setParsedRecipe(null);
    } else {
      // Go back to recipes list
      navigate('/recipes');
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
          onClick={handleBack}
          variant="ghost"
          className="mb-6 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          {parsedRecipe ? 'Back to Input' : 'Back to Recipes'}
        </Button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent">
            Create Recipe with AI
          </h1>
          <p className="mt-2 text-gray-600">
            {parsedRecipe 
              ? 'Review and edit the AI-generated recipe before saving.'
              : 'Paste a recipe or describe what you want to make, and our AI will format it for you.'}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          {parsedRecipe ? (
            // Recipe Editor View
            <RecipeEditor
              initialRecipe={parsedRecipe}
              onSubmit={handleSubmit}
              categories={categories}
              isLoading={isSubmitting}
            />
          ) : (
            // Input View
            <div className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Paste a recipe or describe what you want to make..."
                className="w-full h-64 resize-none"
                disabled={isProcessing}
              />
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="text-emerald-700 border-emerald-300"
                  disabled={isProcessing}
                >
                  <MicrophoneIcon className="h-5 w-5 mr-2" />
                  Record
                </Button>
                
                <Button
                  type="button"
                  onClick={handleParseRecipe}
                  className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white px-6 py-2
                    hover:shadow-lg hover:shadow-emerald-300 transition-all duration-200"
                  disabled={isProcessing || !userInput.trim()}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                      Generate Recipe
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RecipeAI() {
  return (
    <RecipeProvider>
      <RecipeAIContent />
    </RecipeProvider>
  );
}