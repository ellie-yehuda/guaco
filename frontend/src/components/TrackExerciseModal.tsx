import { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

type ExerciseFormData = {
  name?: string;
  qty?: number;
  unit?: string;
  kcal?: number;
  notes?: string;
};

interface TrackExerciseModalProps {
  onClose: () => void;
  onSave: (data: ExerciseFormData) => void;
}

const TrackExerciseModal = ({ onClose, onSave }: TrackExerciseModalProps) => {
  const [formData, setFormData] = useState<ExerciseFormData>({
    name: '',
    qty: 30,
    unit: 'min',
    kcal: 0,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'name' || name === 'unit' || name === 'notes' 
        ? value 
        : parseFloat(value) || 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Common exercise suggestions
  const exerciseSuggestions = [
    { name: 'Walking', kcal: 5, unit: 'min' },
    { name: 'Running', kcal: 10, unit: 'min' },
    { name: 'Cycling', kcal: 8, unit: 'min' },
    { name: 'Swimming', kcal: 9, unit: 'min' },
    { name: 'Weight Training', kcal: 7, unit: 'min' },
    { name: 'Yoga', kcal: 4, unit: 'min' },
  ];

  const selectExercise = (exercise: typeof exerciseSuggestions[0]) => {
    setFormData({
      ...formData,
      name: exercise.name,
      kcal: exercise.kcal * (formData.qty || 30),
      unit: exercise.unit,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Add Exercise</h3>
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
                Activity Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Running"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-2 gap-2">
                {exerciseSuggestions.map(exercise => (
                  <button
                    key={exercise.name}
                    type="button"
                    className={`px-3 py-2 rounded text-sm ${
                      formData.name === exercise.name
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => selectExercise(exercise)}
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="qty" className="block text-sm font-medium text-gray-700">
                  Duration
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
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  required
                >
                  <option value="min">minutes</option>
                  <option value="hours">hours</option>
                  <option value="reps">repetitions</option>
                  <option value="sets">sets</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="kcal" className="block text-sm font-medium text-gray-700">
                Calories Burned (kcal)
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

export default TrackExerciseModal;