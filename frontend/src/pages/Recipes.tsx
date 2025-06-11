import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes, RecipeProvider } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';
import { Button } from "../components/ui/Button";

/**
 * Recipes Page – vibrant redesign ✨
 */

const RecipesContent = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { recipes, fetchRecipes } = useRecipes();
  const [activeCategory, setActiveCategory] = useState(categoryId || '');

  const categories = [
    { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
    { id: 'lunch', name: 'Lunch', icon: '🥗' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️' },
    { id: 'healthy-snacks', name: 'Healthy Snacks', icon: '🥜' },
    { id: 'sugary-snacks', name: 'Sugary Snacks', icon: '🍪' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  // Update active category when URL changes
  useEffect(() => {
    if (categoryId && categoryId !== activeCategory) {
      setActiveCategory(categoryId);
    }
  }, [categoryId]);

  // Fetch recipes when active category changes
  useEffect(() => {
    fetchRecipes(activeCategory);
  }, [activeCategory]);

  // Update URL when active category changes (without causing a loop)
  useEffect(() => {
    if (activeCategory) {
      const currentPath = `/recipes/category/${activeCategory}`;
      if (window.location.pathname !== currentPath) {
        navigate(currentPath, { replace: true });
      }
    }
  }, [activeCategory, navigate]);

  const handleAddNewRecipe = () => {
    navigate('/add-recipe');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 relative overflow-hidden">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-24 -left-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-teal-400/40 via-green-300/40 to-transparent blur-3xl opacity-50" />
      <div className="pointer-events-none absolute -bottom-24 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-bl from-purple-400/40 via-fuchsia-300/40 to-transparent blur-3xl opacity-50" />

      {/* Add New Recipe Button directly on background */}
      <div className="absolute top-6 right-24 z-20">
        <Button
          onClick={handleAddNewRecipe}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white rounded-full
            hover:shadow-lg hover:shadow-emerald-300 transition-all duration-200 transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
        >
          <span className="mr-2">✨</span>
          Add New Recipe
        </Button>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        {/* Category Navigation */}
        <nav className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  activeCategory === category.id
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 text-emerald-800 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="font-medium text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {category.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {recipes[category.id]?.length || 0} recipes
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Panel */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
              {categories.find(c => c.id === activeCategory)?.name} Recipes
            </h2>
            <Button
              onClick={handleAddNewRecipe}
              variant="outline"
              className="flex items-center px-4 py-2 text-emerald-700 border-2 border-emerald-300 rounded-lg
                hover:bg-emerald-50 transition-all duration-200"
            >
              <span className="mr-2">+</span>
              Add Recipe
            </Button>
          </div>
          {/* Recipe List Component */}
          <RecipeList categoryId={activeCategory} />
        </div>
      </main>
    </div>
  );
};

export default function Recipes() {
  return (
    <RecipeProvider>
      <RecipesContent />
    </RecipeProvider>
  );
}
