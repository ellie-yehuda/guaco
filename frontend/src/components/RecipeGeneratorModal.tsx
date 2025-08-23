import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';
import { useRecipes } from '../context/RecipeContext';
import useUser from '../hooks/useUser';

interface RecipeGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  prompt: string;
}

const RecipeGeneratorModal: React.FC<RecipeGeneratorModalProps> = ({ open, onClose, prompt }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPreference, setDietPreference] = useState('');
  const [excludedIngredients, setExcludedIngredients] = useState('');
  const { showToast } = useToast();
  const { parseRecipeWithAI, createRecipe, categories } = useRecipes();
  const [user] = useUser();
  const navigate = useNavigate();

  // Get user preferences from onboarding if available
  React.useEffect(() => {
    if (user?.dietPreference) {
      setDietPreference(user.dietPreference);
    }
    if (user?.dislikedFoods) {
      setExcludedIngredients(user.dislikedFoods.join(', '));
    }
  }, [user]);

  if (!open) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Format the prompt with user preferences
      let fullPrompt = prompt;
      
      if (dietPreference) {
        fullPrompt += ` that is ${dietPreference}`;
      }
      
      if (excludedIngredients) {
        fullPrompt += ` without ${excludedIngredients}`;
      }
      
      // Call the AI endpoint to generate a recipe
      const generatedRecipe = await parseRecipeWithAI(fullPrompt);
      
      if (!generatedRecipe) {
        throw new Error('Failed to generate recipe');
      }
      
      // Save the recipe
      const savedRecipe = await createRecipe(generatedRecipe);
      
      // Show success toast
      showToast('Recipe generated successfully!', 'success');
      
      // Close modal and navigate to the recipe
      onClose();
      navigate(`/recipes/${savedRecipe._id}`);
    } catch (error) {
      console.error('Error generating recipe:', error);
      showToast('Failed to generate recipe. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Generate Recipe</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <p className="mb-4 text-gray-700">
          I'll generate a recipe based on your prompt: <strong>"{prompt}"</strong>
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diet Preference
          </label>
          <select
            value={dietPreference}
            onChange={(e) => setDietPreference(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">No preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten-Free</option>
            <option value="keto">Keto</option>
            <option value="paleo">Paleo</option>
            <option value="low-carb">Low-Carb</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exclude Ingredients
          </label>
          <input
            type="text"
            value={excludedIngredients}
            onChange={(e) => setExcludedIngredients(e.target.value)}
            placeholder="e.g., nuts, dairy, shellfish"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple ingredients with commas
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary-500 text-white"
          >
            {isGenerating ? 'Generating...' : 'Generate Recipe'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeGeneratorModal;