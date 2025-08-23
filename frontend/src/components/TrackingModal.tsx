import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from './ui/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useToast } from '../context/ToastContext';
import { createTrackEvent, NewTrackEvent } from '../utils/trackingApi';

interface TrackingModalProps {
  open: boolean;
  onClose: () => void;
  type: 'water' | 'food' | 'exercise';
  initialValue?: string;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ open, onClose, type, initialValue = '' }) => {
  const [value, setValue] = useState(initialValue);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [meal, setMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | undefined>(undefined);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Check URL parameters for meal and date
  useEffect(() => {
    if (open) {
      const mealParam = searchParams.get('meal') as 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
      if (mealParam) {
        setMeal(mealParam);
      }
      
      // Initialize with value from props
      setValue(initialValue);
      setAmount('');
    }
  }, [open, initialValue, searchParams]);

  if (!open) return null;

  const getTitle = () => {
    switch (type) {
      case 'water':
        return 'Log Water Intake';
      case 'food':
        return 'Log Food';
      case 'exercise':
        return 'Log Exercise';
      default:
        return 'Log Activity';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'water':
        return 'Amount (e.g., 500 ml, 2 cups)';
      case 'food':
        return 'Food name and amount';
      case 'exercise':
        return 'Exercise type and duration';
      default:
        return '';
    }
  };

  const handleSubmit = async () => {
    if (type === 'water' && !amount) return;
    if (type !== 'water' && !value.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get the date from URL or use today
      const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
      
      // Create the tracking event based on type
      let trackEvent: NewTrackEvent;
      
      switch (type) {
        case 'water':
          trackEvent = {
            type: 'water',
            qty: parseInt(amount),
            unit: 'ml'
          };
          break;
        case 'food':
          // Try to parse food input (e.g., "2 eggs")
          const foodMatch = value.match(/^(\d+)\s+(.+)$/);
          let foodQty = 1;
          let foodName = value;
          
          if (foodMatch) {
            foodQty = parseInt(foodMatch[1]);
            foodName = foodMatch[2];
          }
          
          trackEvent = {
            type: 'food',
            meal: meal,
            name: foodName,
            qty: foodQty,
            unit: 'servings'
          };
          break;
        case 'exercise':
          // Try to parse exercise input (e.g., "30 min running")
          const exerciseMatch = value.match(/^(\d+)\s+(\w+)\s+(.+)$/);
          let exerciseQty = 30;
          let exerciseUnit = 'min';
          let exerciseName = value;
          
          if (exerciseMatch) {
            exerciseQty = parseInt(exerciseMatch[1]);
            exerciseUnit = exerciseMatch[2];
            exerciseName = exerciseMatch[3];
          }
          
          trackEvent = {
            type: 'exercise',
            name: exerciseName,
            qty: exerciseQty,
            unit: exerciseUnit
          };
          break;
        default:
          throw new Error('Invalid tracking type');
      }
      
      // Call the API to create the tracking event
      const result = await createTrackEvent(trackEvent);
      
      if (result) {
        // Show success toast with deep link to the tracker for the specific date
        showToast(
          <div>
            Tracked successfully! <button 
              onClick={() => navigate(`/tracker?date=${dateParam}`)}
              className="underline font-medium"
            >
              View in Tracker
            </button>
          </div>,
          'success'
        );
        
        onClose();
        setValue('');
        setAmount('');
      } else {
        throw new Error('Failed to create tracking event');
      }
    } catch (error) {
      console.error(`Error tracking ${type}:`, error);
      showToast(`Failed to track ${type}. Please try again.`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Special handling for water tracking
  const renderWaterTracker = () => {
    const handleIncrement = () => {
      const current = parseInt(amount) || 0;
      setAmount((current + 100).toString());
    };
    
    const handleDecrement = () => {
      const current = parseInt(amount) || 0;
      if (current >= 100) {
        setAmount((current - 100).toString());
      }
    };
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Water Amount (ml)
        </label>
        <div className="flex items-center">
          <button
            onClick={handleDecrement}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-l-md"
          >
            -
          </button>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border-y border-gray-300 px-3 py-2 text-center"
            placeholder="0"
          />
          <button
            onClick={handleIncrement}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-r-md"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {parseInt(amount) ? `${parseInt(amount) / 1000} liters` : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {type === 'water' ? (
          renderWaterTracker()
        ) : type === 'food' ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Details
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal
              </label>
              <select
                value={meal || ''}
                onChange={(e) => setMeal(e.target.value as any)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select a meal</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exercise Details
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        )}
        
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting || 
              (type === 'water' ? !amount : !value.trim()) || 
              (type === 'food' && !meal)
            }
            variant="primary"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;