import React, { useState } from "react";
import { Button } from "./ui/Button";

// Simple Modal implementation
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300">
      <div className="relative w-full bg-white rounded-t-3xl shadow-lg p-6 transform transition-transform duration-300 ease-out translate-y-0 opacity-100">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

interface TrackFoodModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TrackFoodModal: React.FC<TrackFoodModalProps> = ({ open, setOpen }) => {
  const [meal, setMeal] = useState("");
  const [calories, setCalories] = useState("");

  const handleLog = () => {
    // handle log logic here
    setOpen(false);
    setMeal("");
    setCalories("");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-xl p-6 pb-20 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Food</h2>
        <p className="text-gray-500 mb-4">What did you eat?</p>
        <input
          type="text"
          placeholder="Meal or food item"
          className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-lg"
          value={meal}
          onChange={e => setMeal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories (optional)"
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-lg"
          value={calories}
          onChange={e => setCalories(e.target.value)}
        />
        <Button
          className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl hover:bg-rose-600 focus:ring-2 focus:ring-rose-400 text-lg shadow-md"
          onClick={handleLog}
        >
          Log Food
        </Button>
      </div>
    </Modal>
  );
};

export default TrackFoodModal; 