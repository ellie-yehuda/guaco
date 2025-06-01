import React, { useState } from "react";
import { motion } from "framer-motion";
import { FireIcon } from "@heroicons/react/24/outline";
import useUser from "../hooks/useUser";

export default function Home() {
  // Retrieve user from context/hook
  const [user] = useUser();
  const userName = user.name || "Friend";
  // Placeholder XP value
  const [xp] = useState(100);

  // Template data for daily quests
  const [dailyQuests] = useState([
    { id: "logMeals", label: "Log 3 meals", current: 1, total: 3, barColor: "bg-red-500" },
    { id: "walk", label: "Walk 30 minutes", current: 10, total: 30, barColor: "bg-green-500" },
    { id: "drink", label: "Drink 8 cups", current: 8, total: 8, barColor: "bg-blue-500" },
  ]);

  // Template data for special quest
  const [specialQuest] = useState({
    id: "veggieColors",
    label: "Eat 6 colors of veggies",
    current: 3,
    total: 6,
    barColor: "bg-orange-500",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white text-gray-900 font-sans flex flex-col items-center p-6 space-y-10 relative overflow-hidden">
      {/* Background pattern/texture (optional, can be added via global CSS or here) */}
      {/* Example: <div className="absolute inset-0 bg-repeat opacity-10" style={{ backgroundImage: 'url(/path/to/texture.png)' }} /> */}

      {/* Greeting title with entrance animation */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold text-primary-700 drop-shadow-lg text-center relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
      >
        Welcome, {userName}!
      </motion.h1>

      {/* XP Display with bounce animation */}
      <motion.div
        className="flex items-center text-3xl font-bold text-primary-700 bg-white rounded-full px-8 py-3 shadow-lg border-4 border-primary-400 relative z-10 transform transition-transform hover:scale-105"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.3 }}
        whileTap={{ scale: 0.95 }}
      >
        <FireIcon className="w-9 h-9 text-orange-500 mr-3 animate-pulse" />
        {xp} XP
      </motion.div>

      {/* Quests Container - Grid or flex for larger screens */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Daily Quests Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-primary-300 transform transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold text-primary-700 uppercase text-center border-b-2 border-primary-200 pb-3 mb-3">Daily Quests!</h2>
          <div className="space-y-4">
            {dailyQuests.map(({ id, label, current, total, barColor }) => {
              const percent = Math.min((current / total) * 100, 100);
              return (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{label}</span>
                    <span className="text-sm text-gray-600">{current}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border border-gray-400">
                    <motion.div
                      className={`${barColor} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Special Quest Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-orange-400 transform transition-transform hover:rotate-1 hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold text-orange-600 uppercase text-center border-b-2 border-orange-300 pb-3 mb-3">Special Quest!</h2>
          <div className="space-y-4">
            {(() => {
              const { id, label, current, total, barColor } = specialQuest;
              const percent = Math.min((current / total) * 100, 100);
              return (
                <div key={id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800">{label}</span>
                    <span className="text-sm text-gray-600">{current}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden border border-gray-400">
                    <motion.div
                      className={`${barColor} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
