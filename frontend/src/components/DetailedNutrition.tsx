import React from 'react';
import { NutritionData } from '../types/Recipe';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

type DetailedNutritionProps = {
  nutrition: NutritionData;
  isExpanded: boolean;
  onToggle: () => void;
};

const DetailedNutrition: React.FC<DetailedNutritionProps> = ({
  nutrition,
  isExpanded,
  onToggle,
}) => {
  // Helper function to format nutrition values
  const formatValue = (value: number | undefined, unit: string): string => {
    if (value === undefined || value === null) return '–';
    return `${value}${unit}`;
  };

  // Group nutrition data by category
  const nutritionGroups = {
    'Basic Macros': [
      { label: 'Calories', value: formatValue(nutrition.calories, '') },
      { label: 'Protein', value: formatValue(nutrition.protein, 'g') },
      { label: 'Total Carbs', value: formatValue(nutrition.total_carbs, 'g') },
      { label: 'Net Carbs', value: formatValue(nutrition.net_carbs, 'g') },
      { label: 'Fiber', value: formatValue(nutrition.fiber, 'g') },
      { label: 'Total Fat', value: formatValue(nutrition.total_fat, 'g') },
    ],
    'Detailed Fats': [
      { label: 'Saturated Fat', value: formatValue(nutrition.saturated_fat, 'g') },
      { label: 'Monounsaturated Fat', value: formatValue(nutrition.monounsaturated_fat, 'g') },
      { label: 'Polyunsaturated Fat', value: formatValue(nutrition.polyunsaturated_fat, 'g') },
      { label: 'Trans Fat', value: formatValue(nutrition.trans_fat, 'g') },
      { label: 'Cholesterol', value: formatValue(nutrition.cholesterol, 'mg') },
    ],
    'Sugars': [
      { label: 'Total Sugars', value: formatValue(nutrition.total_sugars, 'g') },
      { label: 'Added Sugars', value: formatValue(nutrition.added_sugars, 'g') },
    ],
    'Minerals': [
      { label: 'Sodium', value: formatValue(nutrition.sodium, 'mg') },
      { label: 'Potassium', value: formatValue(nutrition.potassium, 'mg') },
      { label: 'Calcium', value: formatValue(nutrition.calcium, 'mg') },
      { label: 'Iron', value: formatValue(nutrition.iron, 'mg') },
      { label: 'Magnesium', value: formatValue(nutrition.magnesium, 'mg') },
      { label: 'Zinc', value: formatValue(nutrition.zinc, 'mg') },
      { label: 'Selenium', value: formatValue(nutrition.selenium, 'mcg') },
    ],
    'Vitamins': [
      { label: 'Vitamin A', value: formatValue(nutrition.vitamin_a, 'IU') },
      { label: 'Vitamin C', value: formatValue(nutrition.vitamin_c, 'mg') },
      { label: 'Vitamin D', value: formatValue(nutrition.vitamin_d, 'IU') },
      { label: 'Vitamin E', value: formatValue(nutrition.vitamin_e, 'mg') },
      { label: 'Vitamin K', value: formatValue(nutrition.vitamin_k, 'mcg') },
      { label: 'Thiamin (B1)', value: formatValue(nutrition.thiamin, 'mg') },
      { label: 'Riboflavin (B2)', value: formatValue(nutrition.riboflavin, 'mg') },
      { label: 'Niacin (B3)', value: formatValue(nutrition.niacin, 'mg') },
      { label: 'Vitamin B6', value: formatValue(nutrition.vitamin_b6, 'mg') },
      { label: 'Vitamin B12', value: formatValue(nutrition.vitamin_b12, 'mcg') },
      { label: 'Folate', value: formatValue(nutrition.folate, 'mcg') },
    ],
  };

  return (
    <div className="bg-emerald-50 rounded-xl overflow-hidden">
      {/* Basic Nutrition Row - Always visible */}
      <div className="grid grid-cols-5 gap-4 p-4">
        {nutritionGroups['Basic Macros'].slice(0, 5).map(({ label, value }) => (
          <div key={label} className="bg-white rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-600">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center gap-2 py-2 text-emerald-600 hover:text-emerald-700 transition-colors border-t border-emerald-100"
      >
        <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Detailed Nutrition - Expandable */}
      {isExpanded && (
        <div className="p-4 space-y-6 border-t border-emerald-100">
          {Object.entries(nutritionGroups)
            .slice(1) // Skip Basic Macros as they're shown above
            .map(([groupName, items]) => (
              <div key={groupName} className="space-y-2">
                <h4 className="font-semibold text-emerald-700 mb-2">{groupName}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white rounded-lg p-3 flex justify-between items-center"
                    >
                      <span className="text-gray-600">{label}</span>
                      <span className="font-semibold text-emerald-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DetailedNutrition; 