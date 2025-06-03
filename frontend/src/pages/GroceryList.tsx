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
import {
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

/* --------------------------- 1. Data sources ------------------------------ */
import categoryDict from "../../../backend/data/category_map.json";
const ALL_FOOD_NAMES = Object.keys(categoryDict) as string[];

/* --------------------------- 2. Types ------------------------------------ */
type GroceryItem = {
  id: number;
  name: string;
  quantity: number;
  purchased: boolean;
  category: string;
};

/* --------------------------- 3. Helpers ---------------------------------- */
const STORAGE_KEY = "platefulGroceries-v3"; // bump schema
function slug(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
const getCategory = (name: string): string =>
  (categoryDict as Record<string, string>)[slug(name)] ?? "Other";

/* ------------------------ 4. Component ----------------------------------- */
export default function GroceryList() {
  /* —— State —— */
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<string | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isSelectingIngredients, setIsSelectingIngredients] = useState(false);

  // generate recipe from ingredients
  const generateRecipe = async () => {
    if (selectedItemIds.length < 3) {
      alert("Please select at least 3 ingredients to generate a recipe.");
      return;
    }

    const ingredientsToGenerate = items
      .filter((item) => selectedItemIds.includes(item.id))
      .map((item) => item.name);

    try {
      const response = await fetch("http://localhost:8000/api/generate_recipe_from_ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredientsToGenerate }),
      });
      const data = await response.json();
      setGeneratedRecipe(data.message);
      setIsRecipeModalOpen(true);
      setSelectedItemIds([]); // Clear selection after generating
    } catch (error) {
      console.error("Error generating recipe:", error);
      alert("Failed to generate recipe.");
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
    if (newName.length === 0) return setSuggestions([]);
    const needle = slug(newName);
    const matches = ALL_FOOD_NAMES.filter((n) => n.startsWith(needle)).slice(0, 8);
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
        purchased: false,
        category: getCategory(trimmed),
      },
    ]);
    resetInput();
  };
  const resetInput = () => {
    setNewName("");
    setNewQty(1);
    inputRef.current?.focus();
  };
  const togglePurchased = (id: number) =>
    setItems(items.map((i) => (i.id === id ? { ...i, purchased: !i.purchased } : i)));
  const deleteItem = (id: number) => setItems(items.filter((i) => i.id !== id));
  const clearPurchased = () => setItems(items.filter((i) => !i.purchased));

  const toggleItemSelected = (id: number) => {
    setSelectedItemIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((itemId) => itemId !== id)
        : [...prevSelected, id]
    );
  };

  const handleGenerateRecipeClick = () => {
    if (isSelectingIngredients) {
      generateRecipe();
    } else {
      setIsSelectingIngredients(true);
    }
  };

  const handleCancelSelection = () => {
    setIsSelectingIngredients(false);
    setSelectedItemIds([]);
  };

  /* —— Derived —— */
  const activeItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);
  const liveCategory = newName ? getCategory(newName) : null;

  const isGenerateRecipeButtonDisabled = selectedItemIds.length < 3;

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
          className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8"
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
                <ul className="absolute left-0 right-0 bg-white border border-emerald-200 rounded-2xl shadow-lg z-10 mt-2 overflow-hidden max-h-72">
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

        {/* ===== Active items ======================================= */}
        <motion.div layout className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-6 space-y-3">
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
              {isSelectingIngredients ? `Generate Recipe (${selectedItemIds.length}/3)` : 'Generate Recipe'}
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
          <ul className="space-y-3">
            <AnimatePresence>
              {activeItems.length === 0 && purchasedItems.length === 0 && (
                <motion.li
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-emerald-400 text-lg">Your grocery list is empty!</p>
                  <p className="text-emerald-300 text-sm mt-2">Add items using the form above</p>
                </motion.li>
              )}

              {activeItems.map(({ id, name, quantity, category, purchased }) => (
                <motion.li
                  key={id}
                  layout
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm transition-all cursor-pointer group
                    ${isSelectingIngredients && selectedItemIds.includes(id) ? 'ring-2 ring-purple-500 bg-purple-50/20' : 'hover:bg-emerald-50/60'}
                  `}
                  onClick={isSelectingIngredients ? () => toggleItemSelected(id) : () => togglePurchased(id)}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && (isSelectingIngredients ? toggleItemSelected(id) : togglePurchased(id))}
                >
                  <span className="flex items-center gap-4">
                    {/* Checkbox for Purchased */}
                    <input
                      type="checkbox"
                      checked={purchased}
                      onChange={(e) => {
                        e.stopPropagation();
                        togglePurchased(id);
                      }}
                      className="h-6 w-6 rounded-lg text-emerald-600 accent-emerald-600 border border-emerald-300 focus:ring-emerald-400 transition-all"
                      aria-label="Mark as purchased"
                    />
                    {/* Removed Checkbox for Selection */}
                    <span className="text-lg font-medium text-gray-700">
                      {name}
                      <span className="ml-2 text-emerald-600 font-semibold bg-emerald-100/70 px-2 py-0.5 rounded-full text-sm">
                        ×{quantity}
                      </span>
                    </span>
                  </span>

                  {/* Category badge */}
                  <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-teal-300">
                    {category}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(id);
                    }}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none p-2 hover:bg-red-50 rounded-xl"
                    aria-label={`Delete ${name}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        {/* ===== Purchased items ==================================== */}
        {purchasedItems.length > 0 && (
          <motion.div layout className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="text-lg">Purchased</span>
              </div>
              <button
                onClick={clearPurchased}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                <XCircleIcon className="w-5 h-5" />
                Clear All
              </button>
            </div>
            <ul className="space-y-2">
              <AnimatePresence>
                {purchasedItems.map(({ id, name, quantity, category }) => (
                  <motion.li
                    key={id}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-green-50/60 text-gray-400 line-through shadow-sm hover:bg-green-50 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-lg">
                        {name}
                        <span className="ml-2 text-green-400 font-medium bg-green-100/70 px-2 py-0.5 rounded-full text-sm">
                          ×{quantity}
                        </span>
                      </span>
                    </span>
                    <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/60 backdrop-blur px-3 py-1 text-sm font-medium text-teal-700 ring-1 ring-teal-300">
                      {category}
                    </span>
                    <button
                      onClick={() => deleteItem(id)}
                      className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none p-2 hover:bg-red-50 rounded-xl"
                      aria-label={`Delete ${name}`}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </div>
      <NavBar />

      {/* Recipe Modal */}
      <AnimatePresence>
        {isRecipeModalOpen && (generatedRecipe) && (
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
              className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <button
                onClick={() => setIsRecipeModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 rounded-full p-2 transition-colors"
                aria-label="Close recipe modal"
              >
                <XCircleIcon className="w-8 h-8" />
              </button>
              <h3 className="text-2xl font-bold text-emerald-700 mb-4">Generated Recipe</h3>
              <div className="prose max-w-none bg-emerald-50/30 p-4 rounded-xl" dangerouslySetInnerHTML={{ __html: generatedRecipe.replace(/\n/g, '<br/>') }} />
              <button
                onClick={() => setIsRecipeModalOpen(false)}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-green-500 text-white rounded-full hover:brightness-110 shadow-lg"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}