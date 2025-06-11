/* ---------------------------------------------------------------------------
   GroceryList.tsx  –  Vibrant redesign with live category preview 🌈
   ---------------------------------------------------------------------------
   • Keeps all original logic (auto‑categorise, localStorage, autocomplete).
   • Adds modern green‑teal gradients + blurred blobs like Recipes page.
   • Shows live category badge while typing.
   • Displays category chips next to each item in the list.
--------------------------------------------------------------------------- */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  XCircleIcon,
  ChevronDownIcon,
  MinusIcon,
  PlusIcon as PlusIconSolid,
  ClockIcon,
  FireIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import DetailedNutrition from '../components/DetailedNutrition';
import RecipeLoader from '../components/RecipeLoader';
import { Recipe } from '../types/Recipe';

/* --------------------------- 1. Data sources ------------------------------ */
import { getCategory, getSuggestions } from "../utils/categoryUtils";

/* --------------------------- 2. Types ------------------------------------ */
type GroceryItem = {
  id: number;
  name: string;
  quantity: number;
  quantity_unit : string;
  purchased: boolean;
  category: string;
};

type CategoryAction = {
  onSelectAll: (items: GroceryItem[]) => void;
  onPurchaseAll: (items: GroceryItem[]) => void;
  itemCount: number;
  selectedCount: number;
  isSelecting: boolean;
  items: GroceryItem[];
};

/* --------------------------- 3. Helpers ---------------------------------- */
const STORAGE_KEY = "platefulGroceries-v3"; // bump schema

/* ------------------------ 4. Component ----------------------------------- */
type PurchaseDialogProps = {
  item: GroceryItem;
  onConfirm: (purchasedQuantity: number) => void;
  onCancel: () => void;
};

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({ item, onConfirm, onCancel }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 shadow-xl max-w-md w-full mx-4 space-y-4"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Mark {item.name} as Purchased
        </h3>
        <p className="text-gray-600">
          How many {item.name} did you purchase?
        </p>
        
        <div className="flex items-center justify-center gap-4 my-6">
          <button
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            disabled={quantity <= 1}
          >
            <MinusIcon className="w-5 h-5" />
          </button>
          <span className="text-2xl font-semibold text-gray-900 w-12 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(q => Math.min(item.quantity, q + 1))}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            disabled={quantity >= item.quantity}
          >
            <PlusIconSolid className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(quantity)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// @ts-ignore
  const CategoryHeader: React.FC<{
  category: string;
  isCollapsed: boolean;
  onToggle: () => void;
  actions: CategoryAction;
}> = ({ category, isCollapsed, actions }) => {
  return (
    <div className="flex items-center gap-2 py-2 group">
      <motion.div
        initial={false}
        animate={{ rotate: isCollapsed ? -90 : 0 }}
        transition={{ duration: 0.2 }}
        className="text-emerald-500 group-hover:text-emerald-600"
      >
        <ChevronDownIcon className="w-5 h-5" />
      </motion.div>
      <h3 className="text-lg font-semibold text-emerald-700 group-hover:text-emerald-800">
        {category}
      </h3>
      <div className="h-px flex-grow bg-emerald-100 group-hover:bg-emerald-200 transition-colors" />
      
      {/* Category actions */}
      <div className="flex items-center gap-2">
        {actions.isSelecting ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.onSelectAll(actions.items);
            }}
            className={`text-sm px-3 py-1 rounded-full transition-colors
              ${actions.selectedCount === actions.itemCount
                ? 'bg-purple-100 text-purple-700'
                : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
              }`}
          >
            {actions.selectedCount === actions.itemCount ? 'Deselect All' : 'Select All'}
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.onPurchaseAll(actions.items);
            }}
            className="text-sm px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            Purchase All
          </button>
        )}
        <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          {actions.itemCount}
        </span>
      </div>
    </div>
  );
};

export default function GroceryList() {
  /* —— State —— */
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [purchaseDialog, setPurchaseDialog] = useState<{ item: GroceryItem } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [, setGeneratedRecipe] = useState<string | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isSelectingIngredients, setIsSelectingIngredients] = useState(false);
  const navigate = useNavigate();
  const [isSaveRecipeModalOpen, setSaveRecipeModalOpen] = useState(false);
  const [recipeToSave, setRecipeToSave] = useState<Recipe | null>(null);
  const [showDetailedNutrition, setShowDetailedNutrition] = useState(false);
  const [newUnit, setNewUnit] = useState("units");
  const unitOptions = ["units", "g", "ml", "oz", "lb", "kg", "liters", "units", "package", "6 pack", "dozen"];
  const [isGeneratingRecipe, setIsGeneratingRecipe] = useState(false);

  const recipeCategories = [
    { id: 'breakfast', name: 'Breakfast', icon: '🍳' },
    { id: 'lunch', name: 'Lunch', icon: '🥗' },
    { id: 'dinner', name: 'Dinner', icon: '🍽️' },
    { id: 'healthy-snacks', name: 'Healthy Snacks', icon: '🥜' },
    { id: 'sugary-snacks', name: 'Sugary Snacks', icon: '🍪' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' }
  ];

  const handleSaveRecipe = async (categoryId: string) => {
    if (!recipeToSave) return;

    try {
      const response = await fetch('http://localhost:8000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: recipeToSave.title,
          summary: recipeToSave.summary,
          category: categoryId,
          instructions: recipeToSave.instructions
        }),
      });

      if (response.ok) {
        setSaveRecipeModalOpen(false);
        setRecipeToSave(null);
        // Navigate to the recipes page in the selected category
        navigate(`/recipes/category/${categoryId}`);
      } else {
        alert('Failed to save recipe. Please try again.');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  };

  // generate recipe from ingredients
  const generateRecipe = async () => {
    if (selectedItemIds.length < 3) {
      alert("Please select at least 3 ingredients to generate a recipe.");
      return;
    }

    setIsGeneratingRecipe(true);

    const ingredientsToGenerate = items
      .filter((item) => selectedItemIds.includes(item.id))
      .map((item) => item.name);

    console.log("Generating recipe with ingredients:", ingredientsToGenerate);

    try {
      const response = await fetch("http://localhost:8000/api/generate_recipe_from_ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({ ingredients: ingredientsToGenerate }),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to generate recipe: ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Recipe data received:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Create recipe object from response
      const recipeData = {
        title: data.title || 'Generated Recipe',
        summary: `Recipe generated from: ${ingredientsToGenerate.join(', ')}`,
        instructions: data.instructions,
        ingredients: data.ingredients,
        spices: data.spices,
        prep_time: data.prep_time,
        cook_time: data.cook_time,
        servings: data.servings,
        nutrition: data.nutrition,
        full_text: data.full_text
      };

      console.log("Nutrition Data:", recipeData.nutrition);
      console.log("Setting recipe data:", recipeData);
      setRecipeToSave(recipeData);
      setGeneratedRecipe(data.full_text);
      setIsRecipeModalOpen(true);
      if (!isSelectingIngredients) {
        setSelectedItemIds([]); // Clear selection after generating
      }
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      alert(`Failed to generate recipe: ${error.message}`);
    } finally {
      setIsGeneratingRecipe(false);
    }
  };

  /* —— Effects —— */
  useEffect(() => {
    const saved: GroceryItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ).map((it: any) => (it.category ? it : { ...it, category: getCategory(it.name) }));
    setItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* —— Autocomplete —— */
  useEffect(() => {
    if (newName.length === 0) {
      setSuggestions([]);
      return;
    }
    const matches = getSuggestions(newName);
    setSuggestions(matches);
  }, [newName]);

  /* —— CRUD helpers —— */
  const addItem = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    if (items.some((i) => i.name.toLowerCase() === trimmed.toLowerCase() && !i.purchased)) {
      resetInput();
      return;
    }
    setItems([
      ...items,
      {
        id: Date.now(),
        name: trimmed,
        quantity: newQty,
        quantity_unit: newUnit,
        purchased: false,
        category: getCategory(trimmed),
      },
    ]);
    resetInput();
  };

  const resetInput = () => {
    setNewName("");
    setNewQty(1);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const togglePurchased = (id: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)));
  const deleteItem = (id: number) => setItems(items.filter((i) => i.id !== id));
  const restoreItem = (id: number) => setItems(items.map((i) => (i.id === id ? { ...i, purchased: false } : i))); 
  // const clearPurchased = () => setItems(items.filter((i) => !i.purchased));

  const toggleItemSelected = (id: number) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleGenerateRecipeClick = () => {
    if (isSelectingIngredients) {
      if (selectedItemIds.length < 3) {
        alert("Please select at least 3 ingredients to generate a recipe.");
        return;
      }
      generateRecipe();
    } else {
      setIsSelectingIngredients(true);
      setSelectedItemIds([]); // Reset selection when starting
    }
  };

  const handleCancelSelection = () => {
    setIsSelectingIngredients(false);
    setSelectedItemIds([]);
  };

  const handlePurchaseClick = (item: GroceryItem) => {
    if (item.quantity > 1) {
      setPurchaseDialog({ item });
    } else {
      togglePurchased(item.id);
    }
  };

  const handlePurchaseConfirm = (purchasedQuantity: number) => {
    if (!purchaseDialog) return;
    
    const item = purchaseDialog.item;
    if (purchasedQuantity === item.quantity) {
      // Mark entire item as purchased
      togglePurchased(item.id);
    } else {
      // Split the item: create purchased portion and update remaining quantity
      setItems(prevItems => [
        ...prevItems.filter(i => i.id !== item.id),
        {
          ...item,
          quantity: purchasedQuantity,
          purchased: true,
          id: Date.now() // New ID for purchased portion
        },
        {
          ...item,
          quantity: item.quantity - purchasedQuantity
        }
      ]);
    }
    setPurchaseDialog(null);
  };

  /* —— Derived —— */
  const activeItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);
  const liveCategory = newName ? getCategory(newName) : null;

  // Group active items by category
  const itemsByCategory = activeItems.reduce<Record<string, GroceryItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Sort categories alphabetically
  const sortedCategories = Object.keys(itemsByCategory).sort();

  const isGenerateRecipeButtonDisabled = selectedItemIds.length < 3;

  const toggleCategory = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleCategoryPurchaseAll = (categoryItems: GroceryItem[]) => {
    // Mark all items in the category as purchased
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (categoryItems.some(catItem => catItem.id === item.id)) {
          return {
            ...item,
            purchased: true
          };
        }
        return item;
      });
      return updatedItems;
    });
  };

  const handleCategorySelectAll = (categoryItems: GroceryItem[]) => {
    const categoryItemIds = categoryItems.map(item => item.id);
    const areAllSelected = categoryItems.every(item => selectedItemIds.includes(item.id));
    
    if (areAllSelected) {
      // Deselect all items in this category
      setSelectedItemIds(prev => prev.filter(id => !categoryItemIds.includes(id)));
    } else {
      // Select all items in this category
      setSelectedItemIds(prev => [...new Set([...prev, ...categoryItemIds])]);
    }
  };

  /* --------------------------- 5. Render --------------------------------- */
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-32">
      {/* Decorative blurred blob */}
      <div className="pointer-events-none absolute -top-24 -left-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-teal-400/40 via-green-300/40 to-transparent blur-3xl" />

      <div className="max-w-3xl mx-auto w-full px-6 pt-16 space-y-10 relative z-10">
        {/* ===== Header / input ===================================== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 relative z-20"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <ShoppingCartIcon className="w-10 h-10 text-emerald-600" />
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-500 to-green-400 bg-clip-text text-transparent drop-shadow-md">
              Grocery List
            </h2>
          </div>

          {/* ---- Input row ---- */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
            {/* Food name */}
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                className="w-full px-6 py-4 rounded-full border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 text-lg bg-white/80 placeholder-emerald-400 transition-all shadow focus:bg-white"
                placeholder="Add an item…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                aria-label="Grocery item name"
              />

              {/* Autocomplete dropdown */}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border border-emerald-200 rounded-2xl shadow-lg z-50 mt-2 overflow-hidden max-h-72">
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      className="px-6 py-3 hover:bg-emerald-50 cursor-pointer text-gray-700 transition-colors border-b border-emerald-50 last:border-none"
                      onMouseDown={() => setNewName(s.charAt(0).toUpperCase() + s.slice(1))}
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity */}
            <input
              type="number"
              min="1"
              className="w-24 px-4 py-4 rounded-full border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 text-lg bg-white/80 text-center"
              value={newQty}
              onChange={(e) => setNewQty(+e.target.value)}
              aria-label="Quantity"
            />

            {/* Quantity unit */}
            <select
            className="w-24 px-4 py-4 rounded-full border border-emerald-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/60 text-lg bg-white/80 text-center" 
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            aria-label = "Quantity unit"
            >
              {unitOptions.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>

            {/* Add button */}
            <button
              onClick={addItem}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 text-white rounded-full hover:brightness-110 transition-all text-lg font-semibold shadow-lg shadow-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              aria-label="Add item"
            >
              <PlusIcon className="w-6 h-6" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>

          {/* Live category preview */}
          {liveCategory && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Categorised as:</span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-teal-300">
                {liveCategory}
              </span>
            </div>
          )}
        </motion.div>

        {/* ===== Active items by category ======================================= */}
        <motion.div layout className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 space-y-6">
          <div className="flex justify-between mb-4">
            <button
              onClick={handleGenerateRecipeClick}
              disabled={isSelectingIngredients && isGenerateRecipeButtonDisabled}
              className={`px-6 py-3 rounded-full text-white font-semibold transition-all duration-200
                ${isSelectingIngredients && isGenerateRecipeButtonDisabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 shadow-lg'
                }`}
            >
              {isSelectingIngredients ? `Select Ingredients (${selectedItemIds.length}/3)` : 'Generate Recipe'}
            </button>
            {isSelectingIngredients && (
              <button
                onClick={handleCancelSelection}
                className="ml-4 px-6 py-3 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Empty state */}
          {items.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-emerald-400 text-lg">Your grocery list is empty!</p>
              <p className="text-emerald-300 text-sm mt-2">Add items using the form above</p>
            </motion.div>
          )}

          {/* Active Items */}
          {activeItems.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">Shopping List</h2>
              <AnimatePresence>
                {sortedCategories.map((category) => {
                  const categoryItems = itemsByCategory[category];
                  const selectedInCategory = categoryItems.filter(item => selectedItemIds.includes(item.id)).length;

                  return (
                    <motion.div key={`active-${category}`} layout className="mb-4">
                      <div className="flex items-center justify-between py-2 px-4 bg-white/60 rounded-xl">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="flex items-center gap-2 flex-grow"
                        >
                          <motion.div
                            initial={false}
                            animate={{ rotate: collapsedCategories.has(category) ? -90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDownIcon className="w-5 h-5 text-emerald-500" />
                          </motion.div>
                          <h3 className="text-lg font-semibold text-emerald-700">
                            {category}
                          </h3>
                        </button>

                        <div className="flex items-center gap-3">
                          {isSelectingIngredients ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategorySelectAll(categoryItems);
                              }}
                              className={`px-3 py-1 rounded-full text-sm transition-colors
                                ${selectedInCategory === categoryItems.length
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                                }
                              `}
                            >
                              {selectedInCategory === categoryItems.length ? 'Deselect All' : 'Select All'}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryPurchaseAll(categoryItems);
                              }}
                              className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-sm transition-colors"
                            >
                              Purchase All
                            </button>
                          )}
                          <span className="text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {categoryItems.length}
                          </span>
                        </div>
                      </div>

                      {/* Category items */}
                      <AnimatePresence initial={false}>
                        {!collapsedCategories.has(category) && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3 mt-2 overflow-hidden"
                          >
                            {categoryItems.map((item) => (
                              <motion.li
                                key={item.id}
                                layout
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className={`flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm transition-all cursor-pointer group
                                  ${isSelectingIngredients 
                                    ? selectedItemIds.includes(item.id)
                                      ? 'ring-2 ring-purple-500 bg-purple-50'
                                      : 'hover:bg-purple-50/60'
                                    : 'hover:bg-emerald-50/60'
                                  }
                                `}
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  if (isSelectingIngredients) {
                                    toggleItemSelected(item.id);
                                  } else {
                                    handlePurchaseClick(item);
                                  }
                                }}
                              >
                                <span className="flex items-center gap-4">
                                  {isSelectingIngredients ? (
                                    <input
                                      type="checkbox"
                                      checked={selectedItemIds.includes(item.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleItemSelected(item.id);
                                      }}
                                      className="h-6 w-6 rounded-lg text-purple-600 accent-purple-600 border border-purple-300 focus:ring-purple-400 transition-all"
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      checked={false}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handlePurchaseClick(item);
                                      }}
                                      className="h-6 w-6 rounded-lg text-emerald-600 accent-emerald-600 border border-emerald-300 focus:ring-emerald-400 transition-all"
                                    />
                                  )}
                                  <span className="text-lg font-medium text-gray-700">
                                    {item.name}
                                    <span className="ml-2 text-emerald-600 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full text-sm">
                                      ×{item.quantity} {item.quantity_unit}
                                    </span>
                                  </span>
                                </span>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Purchased items */}
          {purchasedItems.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-4">Purchased Items</h2>
              <ul className="space-y-2">
                <AnimatePresence>
                  {purchasedItems.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition-all
                        ${isSelectingIngredients
                          ? selectedItemIds.includes(item.id)
                            ? 'bg-purple-50 ring-2 ring-purple-500'
                            : 'bg-green-50/60 hover:bg-purple-50/60'
                          : 'bg-green-50/60'
                        }
                        ${isSelectingIngredients ? 'cursor-pointer' : ''}
                        ${!isSelectingIngredients ? 'text-gray-400 line-through' : ''}
                      `}
                      onClick={(e) => {
                        if (isSelectingIngredients) {
                          e.stopPropagation();
                          toggleItemSelected(item.id);
                        }
                      }}
                    >
                      <span className="flex items-center gap-3">
                        {isSelectingIngredients ? (
                          <input
                            type="checkbox"
                            checked={selectedItemIds.includes(item.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleItemSelected(item.id);
                            }}
                            className="h-6 w-6 rounded-lg text-purple-600 accent-purple-600 border border-purple-300 focus:ring-purple-400 transition-all"
                          />
                        ) : (
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        )}
                        <span className="text-lg">
                          {item.name}
                          <span className="ml-2 text-green-400 font-medium bg-green-100/70 px-2 py-0.5 rounded-full text-sm">
                            ×{item.quantity} {item.quantity_unit}
                          </span>
                        </span>
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-teal-300">
                          {item.category}
                        </span>
                        {!isSelectingIngredients && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                restoreItem(item.id);
                              }}
                              className="text-emerald-400 hover:text-emerald-600 transition-all focus:outline-none p-2 hover:bg-emerald-50 rounded-xl"
                              aria-label={`Restore ${item.name}`}
                            >
                              <ArrowUturnLeftIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                              className="text-red-300 hover:text-red-500 transition-all focus:opacity-100 focus:outline-none p-2 hover:bg-red-50 rounded-xl"
                              aria-label={`Delete ${item.name}`}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </motion.div>
      </div>
      <NavBar />

      {/* Recipe Loading State */}
      <AnimatePresence>
        {isGeneratingRecipe && <RecipeLoader />}
      </AnimatePresence>

      {/* Recipe Modal */}
      <AnimatePresence>
        {isRecipeModalOpen && recipeToSave && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsRecipeModalOpen(false)}
            ></div>
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsRecipeModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-full p-2 transition-colors z-10"
                aria-label="Close recipe modal"
              >
                <XCircleIcon className="w-8 h-8" />
              </button>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 p-6">
                {/* Recipe Content */}
                <div className="space-y-6">
                  {/* Metadata Row */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-emerald-700 mb-3">{recipeToSave?.title || 'Generated Recipe'}</h3>
                    <div className="flex items-center gap-6 text-gray-600">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-emerald-500" />
                        <span>Prep: {recipeToSave?.prep_time || '15'} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FireIcon className="w-5 h-5 text-emerald-500" />
                        <span>Cook: {recipeToSave?.cook_time || '20'} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5 text-emerald-500" />
                        <span>Serves: {recipeToSave?.servings || '4'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Nutrition Information */}
                  {recipeToSave?.nutrition && (
                    <DetailedNutrition
                      nutrition={recipeToSave.nutrition}
                      isExpanded={showDetailedNutrition}
                      onToggle={() => setShowDetailedNutrition(!showDetailedNutrition)}
                    />
                  )}

                  {/* Recipe Content */}
                  <div className="bg-emerald-50/30 rounded-xl overflow-hidden">
                    {/* Ingredients Section */}
                    <div className="p-4">
                      <h4 className="font-semibold text-emerald-700 mb-2">Ingredients</h4>
                      <div className="prose max-w-none text-gray-600" 
                           dangerouslySetInnerHTML={{ 
                             __html: recipeToSave?.ingredients?.replace(/•/g, '◆')
                               .replace(/\n/g, '<br/>')
                               .replace(/◆/g, '<br/>•') || ''
                           }} 
                      />
                    </div>

                    {/* Spices Section */}
                    {recipeToSave?.spices && (
                      <div className="p-4 border-t border-emerald-100">
                        <h4 className="font-semibold text-emerald-700 mb-2">Spices & Seasonings</h4>
                        <div className="prose max-w-none text-gray-600" 
                             dangerouslySetInnerHTML={{ 
                               __html: recipeToSave.spices.replace(/•/g, '◆')
                                 .replace(/\n/g, '<br/>')
                                 .replace(/◆/g, '<br/>•')
                             }} 
                        />
                      </div>
                    )}

                    {/* Instructions Section */}
                    <div className="p-4 border-t border-emerald-100">
                      <h4 className="font-semibold text-emerald-700 mb-2">Instructions</h4>
                      <div className="prose max-w-none text-gray-600" 
                           dangerouslySetInnerHTML={{ 
                             __html: recipeToSave?.instructions?.replace(/(\d+\.)/g, '<br/>$1')
                               .replace(/\n/g, '<br/>') || ''
                           }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed bottom buttons */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-3xl flex gap-3 mt-auto">
                <button
                  onClick={() => generateRecipe()}
                  disabled={isGeneratingRecipe}
                  className={`flex-1 px-6 py-3 rounded-full text-white transition-colors ${
                    isGeneratingRecipe
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-500 hover:bg-purple-600'
                  }`}
                >
                  {isGeneratingRecipe ? 'Generating...' : 'I want something else'}
                </button>
                <button
                  onClick={() => {
                    setIsRecipeModalOpen(false);
                    setSaveRecipeModalOpen(true);
                  }}
                  className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                >
                  Save Recipe
                </button>
                <button
                  onClick={() => setIsRecipeModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Recipe Modal */}
      <AnimatePresence>
        {isSaveRecipeModalOpen && recipeToSave && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSaveRecipeModalOpen(false)}
            ></div>
            <motion.div
              className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h3 className="text-2xl font-bold text-emerald-700 mb-6">Save Recipe</h3>
              <p className="text-gray-600 mb-6">Choose a category to save your recipe:</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {recipeCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleSaveRecipe(category.id)}
                    className="p-4 rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
                  >
                    <div className="text-3xl mb-2 transform group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="font-medium text-gray-800 group-hover:text-emerald-700">
                      {category.name}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSaveRecipeModalOpen(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Purchase Dialog */}
      <AnimatePresence>
        {purchaseDialog && (
          <PurchaseDialog
            item={purchaseDialog.item}
            onConfirm={handlePurchaseConfirm}
            onCancel={() => setPurchaseDialog(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}