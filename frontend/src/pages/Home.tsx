import { useState } from "react";
import { motion } from "framer-motion";
import { FireIcon, TrophyIcon, StarIcon, UserCircleIcon, SparklesIcon, CalendarDaysIcon, BoltIcon } from "@heroicons/react/24/solid";
import useUser from "../hooks/useUser";

export default function Home() {
  // Retrieve user from context/hook
  const [user] = useUser();
  const userName = user.name || "Friend";
  // Placeholder XP value
  const [xp] = useState(100);
  const [level] = useState(5);
  const xpToNextLevel = 200;
  const xpPercent = Math.min((xp / xpToNextLevel) * 100, 100);

  // Template data for daily quests
  const [dailyQuests, setDailyQuests] = useState([
    { id: "logMeals", label: "Log 3 meals", current: 1, total: 3, barColor: "from-emerald-400 to-emerald-600", icon: <TrophyIcon className="w-6 h-6 text-emerald-500" /> },
    { id: "walk", label: "Walk 30 minutes", current: 10, total: 30, barColor: "from-sky-400 to-sky-600", icon: <TrophyIcon className="w-6 h-6 text-sky-500" /> },
    { id: "drink", label: "Drink 8 cups", current: 8, total: 8, barColor: "from-amber-400 to-amber-600", icon: <TrophyIcon className="w-6 h-6 text-amber-500" /> },
  ]);

  // Template data for special quest
  const [specialQuest, setSpecialQuest] = useState({
    id: "veggieColors",
    label: "Eat 6 colors of veggies",
    current: 3,
    total: 6,
    barColor: "from-amber-400 to-amber-600",
    icon: <StarIcon className="w-7 h-7 text-amber-400" />,
  });

  // New state for Weekly Goals and Streak
  const [weeklyGoalProgress] = useState(75); // Percentage for weekly goal
  const [streakDays] = useState(14); // Number of consecutive days

  // Handler for claiming rewards
  const claimReward = (id: string) => {
    setDailyQuests((prev) => prev.map(q => q.id === id ? { ...q, current: 0 } : q));
  };

  // Handler for claiming special quest
  const claimSpecialReward = () => {
    setSpecialQuest((prev) => ({ ...prev, current: 0 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 font-sans flex flex-col items-center p-4 md:p-8 space-y-8 relative overflow-hidden">
      {/* Animated background sparkles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <SparklesIcon className="absolute top-10 left-10 w-16 h-16 text-sky-200 animate-pulse" />
        <SparklesIcon className="absolute bottom-10 right-10 w-20 h-20 text-amber-100 animate-spin-slow" />
      </div>

      {/* Header with avatar and greeting */}
      <motion.div
        className="flex flex-col items-center space-y-2 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.1 }}
      >
        <UserCircleIcon className="w-20 h-20 text-emerald-400 drop-shadow-lg" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700 drop-shadow-lg text-center">
          Welcome, <span className="text-amber-500">{userName}</span>!
        </h1>
        <div className="text-lg text-gray-500">Level {level}</div>
      </motion.div>

      {/* XP Progress Ring */}
      <motion.div
        className="relative flex items-center justify-center z-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.3 }}
      >
        <svg className="w-32 h-32 rotate-[-90deg]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" /> {/* gray-200 */}
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke="#f59e0b" /* amber-500 */
            strokeWidth="10"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - xpPercent / 100)}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - xpPercent / 100) }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <FireIcon className="w-10 h-10 text-amber-500 animate-pulse mb-1" />
          <span className="text-2xl font-bold text-emerald-700">{xp} XP</span>
          <span className="text-xs text-gray-500">to next level: {xpToNextLevel - xp}</span>
        </div>
      </motion.div>

      {/* Main Dashboard Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        {/* Daily Quests Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-emerald-300 transform transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold text-emerald-700 uppercase text-center border-b-2 border-emerald-200 pb-3 mb-3 flex items-center justify-center gap-2">
            <TrophyIcon className="w-7 h-7 text-emerald-400" /> Daily Quests
          </h2>
          <div className="space-y-4">
            {dailyQuests.map(({ id, label, current, total, barColor, icon }) => {
              const percent = Math.min((current / total) * 100, 100);
              const isComplete = current >= total;
              return (
                <div key={id} className={`space-y-1 rounded-xl p-3 ${isComplete ? "bg-emerald-50 border-2 border-emerald-300 shadow-md" : ""}`}>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium text-gray-800">{icon}{label}</span>
                    <span className="text-sm text-gray-600">{current}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                    <motion.div
                      className={`bg-gradient-to-r ${barColor} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                  {isComplete && (
                    <motion.button
                      className="mt-2 px-4 py-1 bg-emerald-500 text-white rounded-full font-semibold shadow hover:bg-emerald-600 transition"
                      whileTap={{ scale: 0.95 }}
                      onClick={() => claimReward(id)}
                    >
                      Claim Reward
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Special Quest Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-amber-400 transform transition-transform hover:rotate-1 hover:scale-105 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Glowing border for boss quest */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 blur-lg opacity-60 animate-pulse pointer-events-none" />
          <h2 className="text-xl font-semibold text-amber-600 uppercase text-center border-b-2 border-amber-300 pb-3 mb-3 flex items-center justify-center gap-2 relative z-10">
            <StarIcon className="w-8 h-8 text-amber-400 animate-bounce" /> Boss Quest
          </h2>
          <div className="space-y-4 relative z-10">
            {(() => {
              const { id, label, current, total, barColor, icon } = specialQuest;
              const percent = Math.min((current / total) * 100, 100);
              const isComplete = current >= total;
              return (
                <div key={id} className={`space-y-1 rounded-xl p-3 ${isComplete ? "bg-amber-50 border-2 border-amber-300 shadow-md" : ""}`}>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 font-medium text-gray-800">{icon}{label}</span>
                    <span className="text-sm text-gray-600">{current}/{total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300">
                    <motion.div
                      className={`bg-gradient-to-r ${barColor} h-full rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </div>
                  {isComplete && (
                    <motion.button
                      className="mt-2 px-4 py-1 bg-amber-500 text-white rounded-full font-semibold shadow hover:bg-amber-600 transition"
                      whileTap={{ scale: 0.95 }}
                      onClick={claimSpecialReward}
                    >
                      Claim Boss Reward
                    </motion.button>
                  )}
                </div>
              );
            })()}
          </div>
        </motion.div>

        {/* Weekly Goals Card (Circular Progress) */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-sky-300 transform transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold text-sky-700 uppercase text-center border-b-2 border-sky-200 pb-3 mb-3 flex items-center justify-center gap-2">
            <CalendarDaysIcon className="w-7 h-7 text-sky-400" /> Weekly Goals
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" /> {/* gray-200 */}
                <motion.circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#0ea5e9" /* sky-500 */
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={2 * Math.PI * 45 * (1 - weeklyGoalProgress / 100)}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - weeklyGoalProgress / 100) }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold text-sky-700">{weeklyGoalProgress}%</span>
                <span className="text-sm text-gray-500">Completed</span>
              </div>
            </div>
            <p className="text-center text-gray-600">You're making great progress this week!</p>
          </div>
        </motion.div>

        {/* Streak Counter Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-4 border-emerald-300 transform transition-transform hover:scale-105"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileTap={{ scale: 0.98 }}
        >
          <h2 className="text-xl font-semibold text-emerald-700 uppercase text-center border-b-2 border-emerald-200 pb-3 mb-3 flex items-center justify-center gap-2">
            <BoltIcon className="w-7 h-7 text-emerald-400" /> Current Streak
          </h2>
          <div className="flex flex-col items-center justify-center space-y-4">
            <motion.div
              className="flex items-center justify-center w-24 h-24 rounded-full bg-emerald-100 border-4 border-emerald-300 text-emerald-700 font-extrabold text-5xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 1.3 }}
            >
              {streakDays}
            </motion.div>
            <p className="text-center text-gray-600">
              Consecutive days active! Keep it up!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
