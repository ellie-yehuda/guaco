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
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Water Intake</h2>
        <p className="text-gray-500 mb-4">How many cups of water did you drink?</p>
        <div className="flex items-center space-x-4 mb-6">
          <Button
            className="px-3 py-1 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 focus:ring-2 focus:ring-sky-400"
            onClick={() => setCups(c => Math.max(0, c - 1))}
            aria-label="Decrease cups"
            variant="outline"
          >-</Button>
          <span className="text-2xl font-semibold">{cups}</span>
          <Button
            className="px-3 py-1 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 focus:ring-2 focus:ring-sky-400"
            onClick={() => setCups(c => c + 1)}
            aria-label="Increase cups"
            variant="outline"
          >+</Button>
        </div>
        <Button
          className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 focus:ring-2 focus:ring-sky-400"
          onClick={handleLog}
        >
          Log Water
        </Button>
      </div>
    </Modal>
  );
};

export default TrackWaterModal; 