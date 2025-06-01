import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../components/NavBar";

const STORAGE_KEY = "platefulGroceries";

export default function GroceryList() {
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState(1);
  const inputRef = useRef();

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setItems(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!newName.trim()) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newName.trim(),
        quantity: newQty,
        purchased: false,
      },
    ]);
    setNewName("");
    setNewQty(1);
    inputRef.current?.focus();
  };

  const togglePurchased = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, purchased: !i.purchased } : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white flex flex-col pb-32">
      <div className="max-w-xl mx-auto p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-lg space-y-8 mt-8">
        <h2 className="text-2xl font-bold text-primary-600 text-center mb-2">Grocery List</h2>

        {/* Add new */}
        <div className="flex space-x-2 items-center">
          <input
            ref={inputRef}
            className="flex-1 px-4 py-3 rounded-2xl border focus:ring-2 focus:ring-primary-300 text-lg shadow-sm bg-white"
            placeholder="e.g. Almond Milk"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addItem(); }}
          />
          <input
            type="number"
            min="1"
            className="w-20 px-3 py-3 rounded-2xl border focus:ring-2 focus:ring-primary-300 text-lg shadow-sm bg-white"
            value={newQty}
            onChange={e => setNewQty(+e.target.value)}
          />
          <button
            onClick={addItem}
            className="px-5 py-3 bg-primary-500 text-white rounded-2xl hover:bg-primary-600 transition text-lg font-semibold shadow"
          >
            +
          </button>
        </div>

        {/* List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {items.length === 0 && (
              <motion.li
                className="text-center text-gray-400 py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Your grocery list is empty!
              </motion.li>
            )}
            {items.map(({ id, name, quantity, purchased }) => (
              <motion.li
                key={id}
                layout
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`flex items-center justify-between p-4 rounded-2xl shadow transition cursor-pointer group ${
                  purchased ? "bg-green-50 line-through text-gray-400" : "bg-gray-100 hover:bg-primary-50"
                }`}
                onClick={() => togglePurchased(id)}
              >
                <span className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={purchased}
                    onChange={e => { e.stopPropagation(); togglePurchased(id); }}
                    className="h-5 w-5 text-primary-500 accent-primary-500"
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="text-lg">{name} <span className="text-primary-500 font-semibold">×{quantity}</span></span>
                </span>
                <button
                  onClick={e => { e.stopPropagation(); deleteItem(id); }}
                  className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                  title="Delete"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <NavBar />
    </div>
  );
}
