import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import RecipeList from '../components/RecipeList';

const Recipes = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { recipes, fetchRecipes, isLoading } = useRecipes();
  const [activeCategory, setActiveCategory] = useState(categoryId || 'breakfast');

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
    const currentPath = `/recipes/category/${activeCategory}`;
    if (window.location.pathname !== currentPath) {
      navigate(currentPath, { replace: true });
    }
  }, [activeCategory, navigate]);

  const handleAddNewRecipe = () => {
    navigate('/add-recipe');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50/70 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-primary flex items-center hover:opacity-80 transition-opacity">
              <span className="mr-2">🍽️</span>
              <span className="bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                Plateful
              </span>
            </Link>
            <button
              onClick={handleAddNewRecipe}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-xl
                hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 transform hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span className="mr-2">✨</span>
              Add New Recipe
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <nav className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                  activeCategory === category.id
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-lg'
                    : 'border-gray-200 hover:border-primary/30 hover:bg-white'
                }`}
              >
                <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div className="font-medium text-gray-800 group-hover:text-primary transition-colors">
                  {category.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {recipes[category.id]?.length || 0} recipes
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* Recipe List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                {categories.find(c => c.id === activeCategory)?.name} Recipes
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {recipes[activeCategory]?.length || 0} recipes in this category
              </p>
            </div>
            <button
              onClick={handleAddNewRecipe}
              className="flex items-center px-4 py-2 text-primary border-2 border-primary/20 rounded-lg
                hover:bg-primary/5 transition-all duration-200"
            >
              <span className="mr-2">+</span>
              Add Recipe
            </button>
          </div>
          <RecipeList categoryId={activeCategory} />
        </div>
      </main>
    </div>
  );
};

export default Recipes; 