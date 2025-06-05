import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const foodEmojis = ['🍳', '🥗', '🍝', '🥘', '🍲', '🥪', '🥙', '🌮', '🥑', '🥬'];
const loadingMessages = [
  'Just a second…',
  'Matching ingredients…',
  'Preparing recipe…',
  'Calculating macros…',
  'Almost ready…',
];

const RecipeLoader: React.FC = () => {
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle through emojis and messages
    const interval = setInterval(() => {
      setCurrentEmojiIndex((prev) => (prev + 1) % foodEmojis.length);
      setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
      >
        {/* Loader Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Emoji in the center */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentEmojiIndex}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center text-4xl"
            >
              {foodEmojis[currentEmojiIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Loading Message */}
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMessageIndex}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-lg text-emerald-800 font-medium"
          >
            {loadingMessages[currentMessageIndex]}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RecipeLoader; 