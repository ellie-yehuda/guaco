import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, FieldErrors } from "react-hook-form";
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

  // Step 2: Focus Priorities
  const focusOptions = [
    'Eating healthier', 'Improving sleep', 'More energy',
    'Emotional balance', 'Consistency', 'Build muscle', 'Lose fat'
  ];

  // Step 3: Dietary Preferences
  const dietOptions = [
    { id: 'none', label: 'No specific diet' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'keto', label: 'Keto' },
    { id: 'paleo', label: 'Paleo' }
  ];
  const dislikeOptions = [
    { id: 'chicken', label: 'Chicken' },
    { id: 'beef', label: 'Beef' },
    { id: 'milk', label: 'Milk' },
    { id: 'eggs', label: 'Eggs' }
  ];

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

  // Define type for priorities
  type Priorities = { [key: string]: number };

  // Define the form data interface
  interface FormData {
    age: number | undefined;
    height: number | undefined;
    weight: number | undefined;
    sexAssigned: string;
    genderIdentity: string;
    hormonalTherapy: boolean | null | undefined;
    priorities: Priorities;
    diet: string;
    disliked: string[];
    allergies: string[];
  }

  // React Hook Form setup
  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      age: user.age || undefined,
      height: user.height || undefined,
      weight: user.weight || undefined,
      sexAssigned: user.sexAssigned || "",
      genderIdentity: user.genderIdentity || "",
      hormonalTherapy: user.hormonalTherapy === true ? true : (user.hormonalTherapy === false ? false : undefined),
      priorities: focusOptions.reduce((acc, key) => ({ ...acc, [key]: user.priorities?.[key] ?? 0 }), {}) as Priorities,
      diet: user.diet || 'none',
      disliked: user.disliked || [],
      allergies: user.allergies || []
    }
  });

  // Watch form values for conditional rendering and completion calculation
  const age = watch("age");
  const height = watch("height");
  const weight = watch("weight");
  const sexAssigned = watch("sexAssigned");
  const genderIdentity = watch("genderIdentity");
  const hormonalTherapy = watch("hormonalTherapy");
  const priorities = watch("priorities");
  const diet = watch("diet");
  const disliked = watch("disliked");
  const allergies = watch("allergies");

  // Conditionally register hormonalTherapy when needed
  // useEffect(() => {
  //   if (sexAssigned && genderIdentity && sexAssigned !== genderIdentity) {
  //     register("hormonalTherapy", { required: "Hormone therapy preference is required." });
  //   } else {
  //     setValue("hormonalTherapy", undefined);
  //   }
  // }, [sexAssigned, genderIdentity, register, setValue]);

  // Compute completion ratio
  let fillCount = 0, fieldCount = 0;
  if (step === 1) {
    const requiredFields = [age, height, weight, sexAssigned, genderIdentity];
    fieldCount = requiredFields.length;
    fillCount = requiredFields.filter(v => v !== undefined && v !== null && v !== '').length;
    if (sexAssigned && genderIdentity && sexAssigned !== genderIdentity) {
      fieldCount += 1; // Add 1 to total fields if hormonalTherapy is relevant
      if (hormonalTherapy !== null) { // Check if hormonalTherapy has a value
        fillCount += 1;
      }
    }
  } else if (step === 2) {
    fieldCount = focusOptions.length;
    fillCount = Object.values(priorities).filter((v: number) => v > 0).length;
  } else if (step === 3) {
    fieldCount = 1; // for diet
    fillCount = (diet && diet !== 'none' ? 1 : 0);
    if (disliked.length > 0) {
        fieldCount += dislikeOptions.length;
        fillCount += disliked.length;
    }
  } else { // step 4
    fieldCount = allergenOptions.length;
    fillCount = allergies.length;
  }
  const completion = fieldCount ? fillCount / fieldCount : 0;

  // Navigation
  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  const finish = handleSubmit((data) => {
    saveUser({
      ...user,
      ...data
    });
    navigate('/home');
  });

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
          <h1 className="text-2xl font-semibold text-gray-900">Onboarding ({step}/{totalSteps})</h1>
          {step > 1 && (
            <button onClick={prev} className="text-primary-600 hover:text-primary-700 transition-colors">← Back</button>
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
            <h2 className="sm:col-span-2 text-xl font-semibold text-gray-800 mb-2">Personal Information</h2>
            {[{
              label: 'Age (years)', name: 'age', type: 'number', min: 13, max: 100, 
              registerOptions: { required: 'Age is required.', min: { value: 13, message: 'Age must be at least 13.' }, max: { value: 100, message: 'Age must be at most 100.' }, valueAsNumber: true }
            }, {
              label: 'Height (cm)', name: 'height', type: 'number', min: 1, max: 300, 
              registerOptions: { required: 'Height is required.', min: { value: 1, message: 'Height must be a positive number.' }, max: { value: 300, message: 'Height must be at most 300.' }, valueAsNumber: true }
            }, {
              label: 'Weight (kg)', name: 'weight', type: 'number', min: 1, max: 500, 
              registerOptions: { required: 'Weight is required.', min: { value: 1, message: 'Weight must be a positive number.' }, max: { value: 500, message: 'Weight must be at most 500.' }, valueAsNumber: true }
            }].map(({ label, name, type, registerOptions }) => (
              <div key={name} className="space-y-1">
                <label htmlFor={name} className="text-sm font-medium text-gray-700">{label} *</label>
                <input
                  id={name}
                  type={type}
                  {...register(name as keyof FormData, registerOptions)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors[name as keyof FormData] ? 'border-red-500 focus:ring-red-400 animate-shake' : 'border-gray-300 focus:ring-primary-400'
                  }`}
                  placeholder={label.split(' ')[0]}
                />
                {errors[name as keyof FormData] && <p className="text-red-600 text-xs mt-1">{errors[name as keyof FormData]?.message as string}</p>}
              </div>
            ))}
            <div className="space-y-1">
              <label htmlFor="sexAssigned" className="text-sm font-medium text-gray-700">Sex at birth *</label>
              <select
                id="sexAssigned"
                {...register("sexAssigned", { required: "Sex at birth is required." })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                  errors.sexAssigned ? 'border-red-500 focus:ring-red-400 animate-shake' : 'border-gray-300 focus:ring-primary-400'
                }`}
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.sexAssigned && <p className="text-red-600 text-xs mt-1">{errors.sexAssigned.message as string}</p>}
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label htmlFor="genderIdentity" className="text-sm font-medium text-gray-700">Gender identity *</label>
              <select
                id="genderIdentity"
                {...register("genderIdentity", { required: "Gender identity is required." })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                  errors.genderIdentity ? 'border-red-500 focus:ring-red-400 animate-shake' : 'border-gray-300 focus:ring-primary-400'
                }`}
              >
                <option value="">Select...</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="nonbinary">Non-binary</option>
                <option value="other">Other</option>
              </select>
              {errors.genderIdentity && <p className="text-red-600 text-xs mt-1">{errors.genderIdentity.message as string}</p>}
              <p className="text-xs text-gray-500 mt-1">
                We ask for your sex assigned at birth and gender identity to accurately calculate your nutrition needs (macros, calories, etc). This information is kept private and only used to personalize your experience.
              </p>
            </div>
            {sexAssigned && genderIdentity && ((sexAssigned === "male" && genderIdentity !== "man") || (sexAssigned === "female" && genderIdentity !== "woman")) && (
              <div className="sm:col-span-2 space-y-1">
                <label className="text-sm font-medium text-gray-700">Hormone therapy? *</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${hormonalTherapy === true ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setValue("hormonalTherapy", true, { shouldValidate: true })}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${hormonalTherapy === false ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setValue("hormonalTherapy", false, { shouldValidate: true })}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition ${hormonalTherapy === null ? 'bg-gray-400 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setValue("hormonalTherapy", null, { shouldValidate: true })}
                  >
                    Prefer not to say
                  </button>
                </div>
                {errors.hormonalTherapy && <p className="text-red-600 text-xs mt-1">{errors.hormonalTherapy.message as string}</p>}
              </div>
            )}
            {(errors.age || errors.height || errors.weight || errors.sexAssigned || errors.genderIdentity || (sexAssigned && genderIdentity && sexAssigned !== genderIdentity && errors.hormonalTherapy)) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sm:col-span-2 text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200 shadow-sm"
              >
                <p className="font-semibold mb-1">Please correct the following errors:</p>
                <ul className="list-disc list-inside">
                  {errors.age && <li>{errors.age.message as string}</li>}
                  {errors.height && <li>{errors.height.message as string}</li>}
                  {errors.weight && <li>{errors.weight.message as string}</li>}
                  {errors.sexAssigned && <li>{errors.sexAssigned.message as string}</li>}
                  {errors.genderIdentity && <li>{errors.genderIdentity.message as string}</li>}
                  {sexAssigned && genderIdentity && sexAssigned !== genderIdentity && errors.hormonalTherapy && <li>{errors.hormonalTherapy.message as string}</li>}
                </ul>
              </motion.div>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Focus Priorities</h2>
            <p className="text-sm text-gray-600">Adjust the slider for each area based on how important it is to you:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {focusOptions.map(option => (
                <div key={option} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-gray-700 text-sm mb-2 font-medium">{option}</span>
                  <div className="w-full flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Not</span>
                    <motion.input
                      type="range"
                      min="0"
                      max="5"
                      value={priorities[option] || 0}
                      onChange={e => setValue("priorities", { ...priorities, [option]: parseInt(e.target.value) || 0 }, { shouldValidate: true })}
                      className="w-full h-2 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-500 transition-all duration-300 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-primary-600 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.1 }}
                    />
                    <span className="text-xs text-primary-600 font-semibold">Very ({priorities[option] || 0})</span>
                  </div>
                </div>
              ))}
            </div>
            {Object.values(priorities).every((v: number) => v === 0) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-lg border border-red-200 shadow-sm"
              >
                Please select at least one focus priority.
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 3: Dietary Preferences */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dietary Preferences</h2>
              <h3 className="text-md font-medium text-gray-800 mb-2">Eating Style *</h3>
              <div className="flex flex-wrap gap-2">
                {dietOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      diet === option.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => setValue("diet", option.id, { shouldValidate: true })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.diet && <p className="text-red-600 text-xs mt-1">{errors.diet.message as string}</p>}
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Foods to Avoid</h3>
              <div className="flex flex-wrap gap-2">
                {dislikeOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      disliked.includes(option.id)
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() =>
                      setValue("disliked", 
                        disliked.includes(option.id)
                          ? disliked.filter((item: string) => item !== option.id)
                          : [...disliked, option.id]
                      , { shouldValidate: true })}
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
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Allergies & Sensitivities</h2>
              <h3 className="text-md font-medium text-gray-800 mb-2">Select all that apply:</h3>
              <div className="flex flex-wrap gap-2">
                {allergenOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      allergies.includes(option.id)
                        ? 'bg-red-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() =>
                      setValue("allergies", 
                        allergies.includes(option.id)
                          ? allergies.filter((item: string) => item !== option.id)
                          : [...allergies, option.id]
                      , { shouldValidate: true })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
          {step < totalSteps ? (
            <button
              onClick={() => {
                if (step === 1) {
                  handleSubmit(next)();
                } else if (step === 2) {
                  if (Object.values(priorities).every((v: number) => v === 0)) {
                    return;
                  }
                  next();
                } else if (step === 3) {
                  handleSubmit(next)();
                }
              }}
              disabled={!isValid || (step === 2 && Object.values(priorities).every((v: number) => v === 0)) || (step === 3 && !diet)}
              className="px-6 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={finish}
              className="px-6 py-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200"
            >
              Finish Setup
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
