import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

type FoodFormData = {
  name?: string;
  qty?: number;
  unit?: string;
  kcal?: number;
  macros?: {
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  notes?: string;
};

interface TrackFoodModalProps {
  meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onClose: () => void;
  onSave: (data: FoodFormData) => void;
}

const TrackFoodModal = ({ meal, onClose, onSave }: TrackFoodModalProps) => {
  const [formData, setFormData] = useState<FoodFormData>({
    name: '',
    qty: 100,
    unit: 'g',
    kcal: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('macros.')) {
      const macroName = name.split('.')[1] as 'protein' | 'carbs' | 'fat';
      setFormData({
        ...formData,
        macros: {
          ...formData.macros,
          [macroName]: parseFloat(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'name' || name === 'unit' || name === 'notes' 
          ? value 
          : parseFloat(value) || 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {meal ? `Add ${meal.charAt(0).toUpperCase() + meal.slice(1)} Item` : 'Add Food Item'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Food Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Grilled Chicken"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <Input
                  id="qty"
                  name="qty"
                  type="number"
                  value={formData.qty}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange as any}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="g">grams (g)</option>
                  <option value="ml">milliliters (ml)</option>
                  <option value="servings">servings</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="kcal" className="block text-sm font-medium text-gray-700">
                Calories (kcal)
              </label>
              <Input
                id="kcal"
                name="kcal"
                type="number"
                value={formData.kcal}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Macronutrients (g)
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="protein" className="block text-xs text-gray-500">
                    Protein
                  </label>
                  <Input
                    id="protein"
                    name="macros.protein"
                    type="number"
                    value={formData.macros?.protein}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="carbs" className="block text-xs text-gray-500">
                    Carbs
                  </label>
                  <Input
                    id="carbs"
                    name="macros.carbs"
                    type="number"
                    value={formData.macros?.carbs}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="fat" className="block text-xs text-gray-500">
                    Fat
                  </label>
                  <Input
                    id="fat"
                    name="macros.fat"
                    type="number"
                    value={formData.macros?.fat}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Any additional notes..."
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackFoodModal;