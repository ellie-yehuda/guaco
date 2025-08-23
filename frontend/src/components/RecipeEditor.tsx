import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Recipe, Ingredient, Category } from '../types/Recipe';
import { XCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

interface RecipeEditorProps {
  initialRecipe?: Partial<Recipe>;
  onSubmit: (recipe: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  categories: Category[];
  isLoading?: boolean;
}

export default function RecipeEditor({ 
  initialRecipe, 
  onSubmit, 
  categories,
  isLoading = false 
}: RecipeEditorProps) {
  const [title, setTitle] = useState(initialRecipe?.title || '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialRecipe?.ingredients || [{ name: '', amount: '' }]
  );
  const [steps, setSteps] = useState<string[]>(
    initialRecipe?.steps || ['']
  );
  const [categoryId, setCategoryId] = useState(initialRecipe?.categoryId || '');
  const [tags, setTags] = useState<string[]>(initialRecipe?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (!title.trim()) {
      setError('Recipe title is required');
      return;
    }
    
    if (!categoryId) {
      setError('Please select a category');
      return;
    }
    
    // Filter out empty ingredients and steps
    const filteredIngredients = ingredients.filter(ing => ing.name.trim());
    const filteredSteps = steps.filter(step => step.trim());
    
    if (filteredIngredients.length === 0) {
      setError('At least one ingredient is required');
      return;
    }
    
    if (filteredSteps.length === 0) {
      setError('At least one step is required');
      return;
    }
    
    // Create recipe object
    const recipe = {
      title,
      ingredients: filteredIngredients,
      steps: filteredSteps,
      categoryId,
      tags: tags.length > 0 ? tags : undefined
    };
    
    setSubmitting(true);
    
    try {
      await onSubmit(recipe);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setError('Failed to save recipe. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (index: number, field: 'name' | 'amount', value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value
    };
    setIngredients(updatedIngredients);
    
    // Add a new empty row if the last row is being filled
    if (index === ingredients.length - 1 && value.trim()) {
      setIngredients([...updatedIngredients, { name: '', amount: '' }]);
    }
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Handle step changes
  const handleStepChange = (index: number, value: string) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
    
    // Add a new empty step if the last step is being filled
    if (index === steps.length - 1 && value.trim()) {
      setSteps([...updatedSteps, '']);
    }
  };

  // Remove step
  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Recipe Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Recipe Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter recipe title"
          className="w-full"
          required
        />
      </div>
      
      {/* Category Selection */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2 focus:border-emerald-500 focus:ring focus:ring-emerald-200"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Ingredients */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ingredients
        </label>
        <div className="space-y-2">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                placeholder="Ingredient name"
                className="flex-grow"
              />
              <Input
                value={ingredient.amount || ''}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="w-1/3"
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Steps */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preparation Steps
        </label>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="mt-2 text-gray-500 font-medium">{index + 1}.</div>
              <Textarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
                className="flex-grow"
                rows={2}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full flex items-center"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-emerald-600 hover:text-emerald-800"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag"
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={addTag}
            variant="outline"
            className="ml-2 text-emerald-700 border-emerald-300"
          >
            <PlusCircleIcon className="h-5 w-5 mr-1" />
            Add
          </Button>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white px-6 py-2
            hover:shadow-lg hover:shadow-emerald-300 transition-all duration-200"
          disabled={submitting || isLoading}
        >
          {submitting || isLoading ? 'Saving...' : 'Save Recipe'}
        </Button>
      </div>
    </form>
  );
}