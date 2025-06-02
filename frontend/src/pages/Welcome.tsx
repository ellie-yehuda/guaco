import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import avo_pic from "/src/assets/images/guacoo.png";

export default function Welcome() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isReturning, setIsReturning] = useState(false);

  // ────────────────────────────────
  //  Check if a user name is stored
  // ────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("platefulUser");
    if (raw) {
      const { name } = JSON.parse(raw);
      if (name) {
        setUserName(name);
        setIsReturning(true);
      }
    }
  }, []);

  // ────────────────────────────────
  //  Handlers
  // ────────────────────────────────
  const saveAndContinue = () => {
    const trimmedName = userName.trim();
    if (!isReturning && trimmedName.length > 1) {
      localStorage.setItem("platefulUser", JSON.stringify({ name: trimmedName }));
      navigate("/onboarding");
    } else if (isReturning) {
      navigate("/home");
    } else {
      console.log("Username is empty or too short for a new user.");
    }
  };

  const reset = () => {
    if (confirm("Delete this local user and start over?")) {
      localStorage.removeItem("platefulUser");
      setUserName("");
      setIsReturning(false);
    }
  };

  // ────────────────────────────────
  //  UI
  // ────────────────────────────────
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-guaco-secondary px-6 py-8 text-guaco-dark-gray overflow-hidden relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative blobs - updated with new color palette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-guaco-primary mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-guaco-accent mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-guaco-primary mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Hero Section */}
      <motion.div
        className="relative z-10 w-full max-w-7xl text-center flex flex-col items-center py-8 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Avocado Illustration with animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            y: [0, -10],
            rotate: [0, 5],
          }}
          transition={{ type: "spring", stiffness: 150, damping: 10, delay: 0.2, repeat: Infinity, repeatType: "reverse", duration: 2 }}
          whileHover={{ scale: 1.05, rotate: 10 }}
        >
          <img
            src={avo_pic}
            alt="Friendly Avocado Illustration"
            className="w-48 h-48 md:w-64 md:h-64 drop-shadow-lg"
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-guaco-dark-gray leading-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          {isReturning ? `Welcome back, ${userName}!` : "Your Wellness Journey Starts Here"}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-xl md:text-2xl text-gray-600 max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
        >
          {isReturning
            ? "Let's pick up where you left off."
            : "Guaco helps you track your meals, set goals, and live a healthier, happier life."}
        </motion.p>

        {/* Name input for new users */}
        {!isReturning && (
          <motion.input
            type="text"
            placeholder="How should I call you?"
            value={userName}
            onChange={(e) =>
              setUserName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
            }
            className="mt-6 w-full max-w-sm rounded-full border border-guaco-light-gray px-4 py-3 text-center text-lg shadow-sm placeholder-gray-400 focus:border-guaco-primary focus:outline-none focus:ring-2 focus:ring-guaco-primary"
            autoFocus
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
          />
        )}

        {/* Call-to-Action Button */}
        <motion.button
          onClick={saveAndContinue}
          disabled={!isReturning && userName.trim().length <= 1}
          className="px-10 py-4 bg-guaco-accent text-white text-lg font-semibold rounded-full shadow-lg hover:bg-guaco-primary transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-guaco-accent/50 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
        >
          {isReturning ? "Continue →" : "Get Started →"}
        </motion.button>

        {isReturning && (
          <motion.button
            onClick={reset}
            className="text-sm text-gray-500 underline hover:text-guaco-primary mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            Delete user
          </motion.button>
        )}
      </motion.div>

      {/* Feature Highlight Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 px-4">
        {/* Feature Card 1 */}
        <motion.div
          className="bg-white/60 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl border border-guaco-light-gray"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: "easeOut" }}
        >
          <div className="text-guaco-primary text-5xl mb-4">
            <span role="img" aria-label="Tracking">
              📊
            </span>
          </div>
          <h3 className="text-xl font-bold text-guaco-dark-gray mb-2">Smart Tracking</h3>
          <p className="text-gray-700">Effortlessly log your meals and monitor your progress.</p>
        </motion.div>

        {/* Feature Card 2 */}
        <motion.div
          className="bg-white/60 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl border border-guaco-light-gray"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
        >
          <div className="text-guaco-primary text-5xl mb-4">
            <span role="img" aria-label="Goals">
              🎯
            </span>
          </div>
          <h3 className="text-xl font-bold text-guaco-dark-gray mb-2">Personalized Goals</h3>
          <p className="text-gray-700">Set and achieve your health objectives with personalized guidance.</p>
        </motion.div>

        {/* Feature Card 3 */}
        <motion.div
          className="bg-white/60 backdrop-blur-md rounded-2xl p-6 text-center shadow-xl border border-guaco-light-gray"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
        >
          <div className="text-guaco-primary text-5xl mb-4">
            <span role="img" aria-label="Community">
              🤝
            </span>
          </div>
          <h3 className="text-xl font-bold text-guaco-dark-gray mb-2">Supportive Community</h3>
          <p className="text-gray-700">Connect with others and share your journey.</p>
        </motion.div>
      </div>

      <motion.p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        Built with 🪄 GenAI
      </motion.p>
    </motion.div>
  );
}
