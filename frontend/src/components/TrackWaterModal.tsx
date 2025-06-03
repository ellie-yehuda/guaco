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

interface TrackWaterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TrackWaterModal: React.FC<TrackWaterModalProps> = ({ open, setOpen }) => {
  const [cups, setCups] = useState(0);

  const handleLog = () => {
    // handle log logic here
    setOpen(false);
    setCups(0);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-xl p-6 pb-20 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Water Intake</h2>
        <p className="text-gray-500 mb-4">How many cups of water did you drink?</p>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            className="px-4 py-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 focus:ring-2 focus:ring-sky-400 text-xl font-bold"
            onClick={() => setCups(c => Math.max(0, c - 1))}
            aria-label="Decrease cups"
            variant="outline"
          >-</Button>
          <span className="text-4xl font-bold text-sky-700">{cups}</span>
          <Button
            className="px-4 py-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 focus:ring-2 focus:ring-sky-400 text-xl font-bold"
            onClick={() => setCups(c => c + 1)}
            aria-label="Increase cups"
            variant="outline"
          >+</Button>
        </div>
        <Button
          className="w-full bg-sky-500 text-white font-bold py-3 rounded-xl hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 text-lg shadow-md"
          onClick={handleLog}
        >
          Log Water
        </Button>
      </div>
    </Modal>
  );
};

export default TrackWaterModal; 