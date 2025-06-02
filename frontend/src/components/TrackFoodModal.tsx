import React, { useState } from "react";
import { Button } from "./ui/Button";

// Simple Modal implementation
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
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
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Food</h2>
        <p className="text-gray-500 mb-4">What did you eat?</p>
        <input
          type="text"
          placeholder="Meal or food item"
          className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          value={meal}
          onChange={e => setMeal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Calories (optional)"
          className="w-full mb-6 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200"
          value={calories}
          onChange={e => setCalories(e.target.value)}
        />
        <Button
          className="w-full bg-rose-500 text-white py-2 rounded-lg hover:bg-rose-600 focus:ring-2 focus:ring-rose-400"
          onClick={handleLog}
        >
          Log Food
        </Button>
      </div>
    </Modal>
  );
};

export default TrackFoodModal; 