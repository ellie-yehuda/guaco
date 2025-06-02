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

interface TrackExerciseModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const exerciseTypes = [
  "Running",
  "Walking",
  "Cycling",
  "Yoga",
  "Strength Training",
  "Other",
];

const TrackExerciseModal: React.FC<TrackExerciseModalProps> = ({ open, setOpen }) => {
  const [type, setType] = useState("");
  const [minutes, setMinutes] = useState("");
  const [notes, setNotes] = useState("");

  const handleLog = () => {
    // handle log logic here
    setOpen(false);
    setType("");
    setMinutes("");
    setNotes("");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-auto">
        <h2 className="text-xl font-bold mb-2">Log Exercise</h2>
        <p className="text-gray-500 mb-4">What exercise did you do?</p>
        <select
          className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={type}
          onChange={e => setType(e.target.value)}
        >
          <option value="">Select type</option>
          {exerciseTypes.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Minutes"
          className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={minutes}
          onChange={e => setMinutes(e.target.value)}
        />
        <textarea
          placeholder="Notes (optional)"
          className="w-full mb-6 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <Button
          className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-400"
          onClick={handleLog}
        >
          Log Exercise
        </Button>
      </div>
    </Modal>
  );
};

export default TrackExerciseModal; 