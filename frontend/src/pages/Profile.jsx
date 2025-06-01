import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUser from '../hooks/useUser';
import {
  XMarkIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

const focusOptions = [
  'Eating healthier', 'Improving sleep', 'More energy',
  'Emotional balance', 'Consistency', 'Build muscle', 'Lose fat'
];

export default function Profile() {
  const navigate = useNavigate();
  const [user, saveUser] = useUser();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('platefulUser') || '{}');
    setProfile(saved);
  }, []);

  // Label maps
  const dietLabels = {
    none: 'No specific diet',
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    pescatarian: 'Pescatarian',
    keto: 'Keto',
    paleo: 'Paleo',
  };
  const allergenLabels = {
    peanuts: 'Peanuts',
    'tree-nuts': 'Tree Nuts',
    milk: 'Dairy',
    eggs: 'Eggs',
    soy: 'Soy',
    wheat: 'Wheat',
    fish: 'Fish',
    shellfish: 'Shellfish',
  };
  const skipLabels = {
    chicken: 'Chicken',
    beef: 'Beef',
    milk: 'Milk',
    eggs: 'Eggs',
  };
  const sexLabels = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  };
  const genderLabels = {
    man: 'Man',
    woman: 'Woman',
    nonbinary: 'Non-binary',
    other: 'Other',
  };

  // Helper for focus priorities
  function renderPriorityBar(val) {
    return (
      <div className="flex items-center space-x-2 w-full">
        <div className="flex-1 h-2 rounded bg-primary-100 overflow-hidden">
          <div
            className="h-2 rounded bg-primary-500 transition-all duration-500"
            style={{ width: `${(val || 0) * 20}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 w-6 text-right">{val || 0}/5</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white text-gray-900 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => navigate('/home')}
              className="text-gray-600 hover:text-gray-900"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Personal Info */}
        <motion.div className="bg-white rounded-xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Personal Info</h2>
            <button onClick={() => navigate('/onboarding')} className="text-primary-600 hover:text-primary-700"><PencilSquareIcon className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div><span className="font-medium">Age:</span> {profile.age || <span className="text-gray-400">—</span>}</div>
            <div><span className="font-medium">Height:</span> {profile.height ? `${profile.height} cm` : <span className="text-gray-400">—</span>}</div>
            <div><span className="font-medium">Weight:</span> {profile.weight ? `${profile.weight} kg` : <span className="text-gray-400">—</span>}</div>
            <div><span className="font-medium">Sex at birth:</span> {sexLabels[profile.sexAssigned] || <span className="text-gray-400">—</span>}</div>
            <div><span className="font-medium">Gender identity:</span> {genderLabels[profile.genderIdentity] || <span className="text-gray-400">—</span>}</div>
            {profile.sexAssigned && profile.genderIdentity && profile.sexAssigned !== profile.genderIdentity && (
              <div><span className="font-medium">Hormone therapy:</span> {profile.hormonalTherapy === true ? 'Yes' : profile.hormonalTherapy === false ? 'No' : 'Prefer not to say'}</div>
            )}
          </div>
        </motion.div>

        {/* Focus Priorities */}
        <motion.div className="bg-white rounded-xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Focus Priorities</h2>
            <button onClick={() => navigate('/onboarding', { state: { step: 2 } })} className="text-primary-600 hover:text-primary-700"><PencilSquareIcon className="w-5 h-5" /></button>
          </div>
          <div className="space-y-2">
            {focusOptions.map(opt => (
              <div key={opt} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 w-40">{opt}</span>
                {renderPriorityBar(profile.priorities?.[opt])}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dietary Preferences */}
        <motion.div className="bg-white rounded-xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Dietary Preferences</h2>
            <button onClick={() => navigate('/onboarding', { state: { step: 3 } })} className="text-primary-600 hover:text-primary-700"><PencilSquareIcon className="w-5 h-5" /></button>
          </div>
          <div className="mb-2"><span className="font-medium">Diet:</span> {dietLabels[profile.diet] || <span className="text-gray-400">—</span>}</div>
          <div className="mb-2"><span className="font-medium">Disliked foods:</span> {profile.disliked && profile.disliked.length > 0 ? (
            <span className="flex flex-wrap gap-2 mt-1">{profile.disliked.map(skip => <span key={skip} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{skipLabels[skip]}</span>)}</span>
          ) : <span className="text-gray-400 ml-2">None</span>}</div>
        </motion.div>

        {/* Allergies & Sensitivities */}
        <motion.div className="bg-white rounded-xl shadow-sm p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Allergies & Sensitivities</h2>
            <button onClick={() => navigate('/onboarding', { state: { step: 4 } })} className="text-primary-600 hover:text-primary-700"><PencilSquareIcon className="w-5 h-5" /></button>
          </div>
          {profile.allergies && profile.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.allergies.map(allergy => (
                <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{allergenLabels[allergy]}</span>
              ))}
            </div>
          ) : <span className="text-gray-400">None</span>}
        </motion.div>

        {/* Edit All Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => navigate('/onboarding')}
            className="px-8 py-3 bg-primary-600 text-white rounded-full shadow hover:bg-primary-700 transition"
          >
            Edit All
          </button>
        </div>
      </div>
    </div>
  );
}
