import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useUser from "../hooks/useUser";

/**
 * Onboarding.jsx
 * Four-step unified onboarding:
 *  1) Personal Info
 *  2) Focus Priorities
 *  3) Dietary Preferences
 *  4) Allergies & Sensitivities
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const [user, saveUser] = useUser();
  const totalSteps = 4;
  const [step, setStep] = useState(1);

  // Step 1: Personal Info
  const [age, setAge] = useState(user.age || "");
  const [height, setHeight] = useState(user.height || "");
  const [weight, setWeight] = useState(user.weight || "");
  const [sexAssigned, setSexAssigned] = useState(user.sexAssigned || "");
  const [genderIdentity, setGenderIdentity] = useState(user.genderIdentity || "");
  const [hormonalTherapy, setHormonalTherapy] = useState(
    user.hormonalTherapy === false ? false : user.hormonalTherapy || null
  );

  // Step 2: Focus Priorities
  const focusOptions = [
    'Eating healthier', 'Improving sleep', 'More energy',
    'Emotional balance', 'Consistency', 'Build muscle', 'Lose fat'
  ];
  const [priorities, setPriorities] = useState(
    focusOptions.reduce((acc, key) => ({ ...acc, [key]: user.priorities?.[key] ?? 0 }), {})
  );

  // Step 3: Dietary Preferences
  const dietOptions = [
    { id: 'none', label: 'No specific diet' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' }
  ];
  const [diet, setDiet] = useState(user.diet || 'none');
  const dislikeOptions = [
    { id: 'chicken', label: 'Chicken' },
    { id: 'beef', label: 'Beef' },
    { id: 'milk', label: 'Milk' },
    { id: 'eggs', label: 'Eggs' }
  ];
  const [disliked, setDisliked] = useState(user.disliked || []);

  // Step 4: Allergies & Sensitivities
  const allergenOptions = [
    { id: 'peanuts', label: 'Peanuts' },
    { id: 'tree-nuts', label: 'Tree Nuts' },
    { id: 'milk', label: 'Dairy' },
    { id: 'eggs', label: 'Eggs' },
    { id: 'soy', label: 'Soy' },
    { id: 'wheat', label: 'Wheat' },
    { id: 'fish', label: 'Fish' },
    { id: 'shellfish', label: 'Shellfish' }
  ];
  const [allergies, setAllergies] = useState(user.allergies || []);

  // Compute completion ratio
  let fillCount = 0, fieldCount = 0;
  if (step === 1) {
    const fields = [age, height, weight, sexAssigned, genderIdentity]
      .concat((sexAssigned && genderIdentity && sexAssigned !== genderIdentity)
        ? [hormonalTherapy]
        : []);
    fieldCount = fields.length;
    fillCount = fields.filter(v => v !== '' && v !== null).length;
  } else if (step === 2) {
    fieldCount = focusOptions.length;
    fillCount = Object.values(priorities).filter(v => v > 0).length;
  } else if (step === 3) {
    fieldCount = 1 + dislikeOptions.length;
    fillCount = (diet ? 1 : 0) + disliked.length;
  } else {
    fieldCount = allergenOptions.length;
    fillCount = allergies.length;
  }
  const completion = fieldCount ? fillCount / fieldCount : 0;

  // Navigation
  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const finish = () => {
    saveUser({
      ...user,
      age, height, weight, sexAssigned, genderIdentity, hormonalTherapy,
      priorities, diet, disliked, allergies
    });
    navigate('/home');
  };

  // Validation
  const valid1 = () => {
    if (!age || !height || !weight || !sexAssigned || !genderIdentity) return false;
    if (sexAssigned !== genderIdentity && hormonalTherapy === null) return false;
    return true;
  };
  const valid2 = () => Object.values(priorities).some(v => v > 0);
  const valid3 = () => diet !== '';
  const valid4 = () => true;

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-lg bg-white backdrop-blur-sm bg-opacity-80 shadow-2xl rounded-2xl p-6 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header & Progress */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Onboarding ({step}/{totalSteps})</h1>
          {step > 1 && (
            <button onClick={prev} className="text-primary-600 hover:underline">← Back</button>
          )}
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={false}
            animate={{ width: `${(completion * 100).toFixed(0)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {[
              { label: 'Age (years)', value: age, setter: setAge, type: 'number' },
              { label: 'Height (cm)', value: height, setter: setHeight, type: 'number' },
              { label: 'Weight (kg)', value: weight, setter: setWeight, type: 'number' }
            ].map(({ label, value, setter, type }) => (
              <div key={label} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">{label} *</label>
                <input
                  type={type}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder={label.split(' ')[0]}
                  value={value}
                  onChange={e => setter(e.target.value)}
                />
              </div>
            ))}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Sex at birth *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                value={sexAssigned}
                onChange={e => setSexAssigned(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-sm font-medium text-gray-700">Gender identity *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                value={genderIdentity}
                onChange={e => setGenderIdentity(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                We ask for your sex assigned at birth and gender identity to accurately calculate your nutrition needs (macros, calories, etc). This information is kept private and only used to personalize your experience.
              </p>
            </div>
            {sexAssigned && genderIdentity && sexAssigned !== genderIdentity && (
              <div className="sm:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Hormone therapy?</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      hormonalTherapy === true
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setHormonalTherapy(true)}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      hormonalTherapy === false
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setHormonalTherapy(false)}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      hormonalTherapy === null
                        ? 'bg-gray-400 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setHormonalTherapy(null)}
                  >
                    Prefer not to say
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Focus Priorities */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600">Adjust the slider for each area based on how important it is to you:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focusOptions.map(option => (
                <div key={option} className="flex flex-col items-center">
                  <span className="text-gray-700 text-sm mb-2">{option}</span>
                  <div className="w-full flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Not</span>
                    <motion.input
                      type="range"
                      min="0"
                      max="5"
                      value={priorities[option] || 0}
                      onChange={e => setPriorities({ ...priorities, [option]: parseInt(e.target.value) || 0 })}
                      className="w-full accent-primary-500 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.1 }}
                    />
                    <span className="text-xs text-primary-600 font-semibold">Very</span>
                  </div>
                  <motion.div
                    className="h-1 w-full rounded bg-primary-200 mt-1"
                    initial={{ width: 0 }}
                    animate={{ width: `${(priorities[option] || 0) * 20}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Dietary Preferences */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Eating Style *</h3>
              <div className="flex flex-wrap gap-2">
                {dietOptions.map(option => (
                  <button
                    key={option.id}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      diet === option.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setDiet(option.id)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Foods to Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {dislikeOptions.map(option => (
                  <button
                    key={option.id}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      disliked.includes(option.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() =>
                      setDisliked(prev =>
                        prev.includes(option.id)
                          ? prev.filter(item => item !== option.id)
                          : [...prev, option.id]
                      )
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Allergies */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Allergies & Sensitivities</h3>
              <div className="flex flex-wrap gap-2">
                {allergenOptions.map(option => (
                  <button
                    key={option.id}
                    className={`px-4 py-2 rounded-full text-sm transition ${
                      allergies.includes(option.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() =>
                      setAllergies(prev =>
                        prev.includes(option.id)
                          ? prev.filter(item => item !== option.id)
                          : [...prev, option.id]
                      )
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end">
          {step < totalSteps ? (
            <button
              onClick={next}
              disabled={step === 1 ? !valid1() : step === 2 ? !valid2() : !valid3()}
              className="px-6 py-2 bg-primary-600 text-white rounded-full shadow hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={finish}
              className="px-6 py-2 bg-primary-600 text-white rounded-full shadow hover:bg-primary-700 transition"
            >
              Finish Setup
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
