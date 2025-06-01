import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import avo_pic from "/src/assets/images/avo_profile.png";

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
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-6 py-16 overflow-hidden text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-primary-200 mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-primary-300 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-primary-400 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 flex flex-col items-center"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Avocado emoji badge */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-200 shadow-lg border-4 border-primary-600">
            <img src={avo_pic} alt="Avocado" className="w-24 h-24 rounded-full" />
          </div>
        </div>

        <div className="mt-10 w-full text-center space-y-4">
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isReturning ? `Welcome back, ${userName}!` : "Welcome to Plateful"}
          </h1>

          <p className="…">
  {isReturning
    ? "Let's pick up where you left off."
    : (
        <>
          I'm Guaco! Your wellness buddy 😊<br/>
          How should I call you?
        </>
      )
  }
</p>


          {!isReturning && (
            <input
              type="text"
              placeholder="Name"
              value={userName}
              onChange={(e) =>
                setUserName(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))
              }
              className="mt-6 w-full rounded-full border border-gray-300 px-4 py-3 text-center text-lg shadow-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          )}
        </div>

        <div className="mt-8 w-full flex flex-col items-center gap-3">
          <button
            onClick={saveAndContinue}
            disabled={!isReturning && userName.trim().length <= 1}
            className="w-full rounded-full bg-gradient-to-r from-primary-500 to-primary-400 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500 hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isReturning ? "Continue →" : "Start →"}
          </button>

          {isReturning && (
            <button onClick={reset} className="text-sm text-gray-500 underline hover:text-primary-600">
              Delete user
            </button>
          )}
        </div>
      </motion.div>

      <motion.p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        Built with 🪄 GenAI
      </motion.p>
    </motion.div>
  );
}
