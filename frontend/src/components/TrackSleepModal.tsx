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

interface TrackSleepModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const TrackSleepModal: React.FC<TrackSleepModalProps> = ({ open, setOpen }) => {
  const [hours, setHours] = useState("");
  const [notes, setNotes] = useState("");

  const handleLog = () => {
    // handle log logic here
    setOpen(false);
    setHours("");
    setNotes("");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-xl p-6 pb-20 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Sleep</h2>
        <p className="text-gray-500 mb-4">How many hours did you sleep?</p>
        <input
          type="number"
          placeholder="Hours slept"
          className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-lg"
          value={hours}
          onChange={e => setHours(e.target.value)}
        />
        <textarea
          placeholder="Notes (optional)"
          className="w-full mb-6 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 text-lg"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <Button
          className="w-full bg-indigo-500 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 text-lg shadow-md"
          onClick={handleLog}
        >
          Log Sleep
        </Button>
      </div>
    </Modal>
  );
};

export default TrackSleepModal; 