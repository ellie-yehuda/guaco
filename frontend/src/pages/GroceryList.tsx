/* ---------------------------------------------------------------------------
   GroceryList.tsx  –  Auto-categorised grocery list with global autocomplete
   ---------------------------------------------------------------------------
   • Uses categoryMap.json built from USDA FoundationFoods.
   • Suggests any of ~8k common food names as you type.
   • Persists list in localStorage (rename STORAGE_KEY to bump schema).
   • Ready for future DB sync; see remarks at the bottom of this file.

   Author: Ellie + ChatGPT (2025-06)
---------------------------------------------------------------------------- */

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

// 🌟 The tiny lookup file we generated.  { "hummus": "Pantry", ... } 
import categoryDict from "../backend/data/GroceryDataset/GroceryDataset4Guaco.csv";

// Turn the keys into an array once; reuse for autocomplete.
const ALL_FOOD_NAMES = Object.keys(categoryDict) as string[];

/* --------------------------- 2. Type definitions -------------------------- */

const STORAGE_KEY = "platefulGroceries-v2"; // bump to avoid clashes with v1

type GroceryItem = {
  id: number;
  name: string;
  quantity: number;
  purchased: boolean;
  /** One of 8 tidy buckets – used later for grouping / colouring */
  category: string;
};

/* --------------------------- 3. Helper functions -------------------------- */

/**
 * Normalise user input so it matches the keys in categoryDict.
 *   "Crème brûlée!" -> "creme brulee"
 */
function slug(text: string): string {
  return text
    .normalize("NFKD") // strip accents
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Map any free-text food name to a bucket, or "Other" */
function getCategory(name: string): string {
  return (categoryDict as Record<string, string>)[slug(name)] ?? "Other";
}

/* --------------------------- 4. Component --------------------------------- */

export default function GroceryList() {
  /* -------- 4.1  State ---------------------------------------------------- */
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  /* -------- 4.2  Load / save localStorage --------------------------------- */
  useEffect(() => {
    // Back-fill category for any legacy items (from v1) that lack it.
    const saved: GroceryItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    ).map((it: any) =>
      it.category ? it : { ...it, category: getCategory(it.name) }
    );
    setItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  /* -------- 4.3  Autofocus on mount -------------------------------------- */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* -------- 4.4  Autocomplete (global list) ------------------------------ */
  useEffect(() => {
    if (newName.length === 0) {
      setSuggestions([]);
      return;
    }
    const needle = slug(newName);
    const matches = ALL_FOOD_NAMES.filter((n) => n.startsWith(needle)).slice(
      0,
      8
    ); // show max 8
    setSuggestions(matches);
  }, [newName]);

  /* -------- 4.5  CRUD helpers -------------------------------------------- */
  const addItem = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    // Prevent duplicates (case-insensitive, un-purchased only)
    if (
      items.some(
        (i) => i.name.toLowerCase() === trimmed.toLowerCase() && !i.purchased
      )
    ) {
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

  /* -------- 4.6  Derived lists ------------------------------------------- */
  const activeItems = items.filter((i) => !i.purchased);
  const purchasedItems = items.filter((i) => i.purchased);

  /* --------------------------- 5.  Render --------------------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col pb-32">
      <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 space-y-8 mt-8">
        {/* ===== Header / input area ====================================== */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 transform hover:scale-[1.01] transition-all"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <ShoppingCartIcon className="w-10 h-10 text-primary-500" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Grocery List
            </h2>
          </div>

          {/* ---- Input row ---- */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Food name -------------------------------------------------- */}
            <div className="relative flex-grow">
              <input
                ref={inputRef}
                className="w-full px-5 py-4 rounded-2xl border-2 border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 text-lg shadow-sm bg-white/80 placeholder-primary-300 transition-all"
                placeholder="Add an item…"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                aria-label="Grocery item name"
                autoFocus
              />

              {/* Autocomplete dropdown  */}
              {suggestions.length > 0 && (
                <ul className="absolute left-0 right-0 bg-white border-2 border-primary-100 rounded-2xl shadow-lg z-10 mt-2 overflow-hidden max-h-72">
                  {suggestions.map((s) => (
                    <li
                      key={s}
                      className="px-5 py-3 hover:bg-primary-50 cursor-pointer text-gray-700 transition-colors border-b border-primary-50 last:border-none"
                      onMouseDown={() =>
                        setNewName(s.charAt(0).toUpperCase() + s.slice(1))
                      }
                    >
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Quantity --------------------------------------------------- */}
            <input
              type="number"
              min="1"
              className="w-24 px-4 py-4 rounded-2xl border-2 border-primary-100 focus:border-primary-300 focus:ring-2 focus:ring-primary-200 text-lg shadow-sm bg-white/80 text-center"
              value={newQty}
              onChange={(e) => setNewQty(+e.target.value)}
              aria-label="Quantity"
            />

            {/* Add button ------------------------------------------------- */}
            <button
              onClick={addItem}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 active:bg-primary-700 transition-all text-lg font-semibold shadow-lg shadow-primary-500/20 focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Add item"
            >
              <PlusIcon className="w-6 h-6" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </motion.div>

        {/* ===== Active items ============================================ */}
        <motion.div layout className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6">
          <ul className="space-y-3">
            <AnimatePresence>
              {/* Empty-list placeholder */}
              {activeItems.length === 0 && purchasedItems.length === 0 && (
                <motion.li
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-primary-300 text-lg">
                    Your grocery list is empty!
                  </p>
                  <p className="text-primary-200 text-sm mt-2">
                    Add items using the form above
                  </p>
                </motion.li>
              )}

              {activeItems.map(({ id, name, quantity, purchased }) => (
                <motion.li
                  key={id}
                  layout
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center justify-between p-4 rounded-2xl shadow-sm transition-all cursor-pointer group bg-gradient-to-r from-primary-50/50 to-white hover:from-primary-100/50 hover:to-primary-50/50"
                  onClick={() => togglePurchased(id)}
                  tabIndex={0}
                  aria-label={`Mark ${name} as purchased`}
                  onKeyDown={(e) => e.key === "Enter" && togglePurchased(id)}
                >
                  {/* Checkbox + label */}
                  <span className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={purchased}
                        onChange={(e) => {
                          e.stopPropagation();
                          togglePurchased(id);
                        }}
                        className="h-6 w-6 rounded-lg text-primary-500 accent-primary-500 border-2 border-primary-200 focus:ring-primary-300 transition-all"
                        aria-label="Purchased"
                      />
                      <motion.div
                        initial={false}
                        animate={{ scale: purchased ? 1 : 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        <CheckCircleIcon className="w-6 h-6 text-primary-500" />
                      </motion.div>
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {name}
                      <span className="ml-2 text-primary-500 font-semibold bg-primary-100/50 px-2 py-0.5 rounded-full text-sm">
                        ×{quantity}
                      </span>
                    </span>
                  </span>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(id);
                    }}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none p-2 hover:bg-red-50 rounded-xl"
                    title="Delete"
                    aria-label={`Delete ${name}`}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </motion.div>

        {/* ===== Purchased items ========================================= */}
        {purchasedItems.length > 0 && (
          <motion.div
            layout
            className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircleIcon className="w-6 h-6" />
                <span className="text-lg">Purchased</span>
              </div>
              <button
                onClick={clearPurchased}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-all text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Clear purchased items"
              >
                <XCircleIcon className="w-5 h-5" />
                Clear All
              </button>
            </div>
            <ul className="space-y-2">
              <AnimatePresence>
                {purchasedItems.map(({ id, name, quantity }) => (
                  <motion.li
                    key={id}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-green-50/50 text-gray-400 line-through shadow-sm group hover:bg-green-50 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      <span className="text-lg">
                        {name}
                        <span className="ml-2 text-green-400 font-medium bg-green-100/50 px-2 py-0.5 rounded-full text-sm">
                          ×{quantity}
                        </span>
                      </span>
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
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Should we set up a database now?
   ---------------------------------
   • **LocalStorage is OK for solo prototyping** – instant, no back-end, but
     data lives only on the current browser / device.
   • **When you need cross-device sync, sharing, or analytics**, switch to a
     real DB (Supabase, Firebase, Postgres via FastAPI, etc.).

   Migration path:
   1. Keep the localStorage logic as a fallback (offline mode).
   2. On first load, POST local items to the server; then mark them “synced”.
   3. Replace the `useEffect` pairs with SWR / React-Query hooks that talk to
      your Rest / GraphQL endpoint.

   For a 2-person MVP you can postpone this until:
   • Authentication is in place, and
   • You design how multiple users share / merge grocery lists (household, etc.).
--------------------------------------------------------------------------- */
