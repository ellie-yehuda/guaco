import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format, addDays, parseISO, isValid } from 'date-fns';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TrackFoodModal from '../components/TrackFoodModal';
import TrackWaterModal from '../components/TrackWaterModal';
import TrackExerciseModal from '../components/TrackExerciseModal';
import LoadingSpinner from '../components/LoadingSpinner';

type TrackEvent = {
  id: string;             // uuid
  ts: string;             // ISO date
  type: 'food'|'water'|'exercise';
  meal?: 'breakfast'|'lunch'|'dinner'|'snack';
  name?: string;          // food/exercise name
  qty?: number;           // grams/ml/mins/servings
  unit?: string;          // 'g'|'ml'|'min'|'servings'
  kcal?: number;
  macros?: { protein?: number; carbs?: number; fat?: number; };
  notes?: string;
};

const WATER_GOAL = 2000; // ml

const Tracker = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get date from URL or default to today
  const dateParam = searchParams.get('date');
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState(
    dateParam && isValid(parseISO(dateParam)) ? dateParam : today
  );
  
  const [events, setEvents] = useState<TrackEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Track which modal is open
  const [activeModal, setActiveModal] = useState<{
    type: 'food' | 'water' | 'exercise';
    meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  } | null>(null);
  
  // Fetch events for the selected date
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/track?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error('Failed to fetch tracking events');
        }
      } catch (error) {
        console.error('Error fetching tracking events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
    
    // Update URL with the selected date
    if (selectedDate !== dateParam) {
      setSearchParams({ date: selectedDate });
    }
  }, [selectedDate, setSearchParams, dateParam]);
  
  // Change date
  const changeDate = (days: number) => {
    const newDate = format(addDays(parseISO(selectedDate), days), 'yyyy-MM-dd');
    setSelectedDate(newDate);
  };
  
  // Add a new event
  const addEvent = async (event: Omit<TrackEvent, 'id' | 'ts'>) => {
    try {
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          ts: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const newEvent = await response.json();
        setEvents([...events, newEvent]);
        setActiveModal(null);
      } else {
        console.error('Failed to add tracking event');
      }
    } catch (error) {
      console.error('Error adding tracking event:', error);
    }
  };
  
  // Delete an event
  const deleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/track/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvents(events.filter(event => event.id !== id));
      } else {
        console.error('Failed to delete tracking event');
      }
    } catch (error) {
      console.error('Error deleting tracking event:', error);
    }
  };
  
  // Calculate totals
  const totals = events.reduce(
    (acc, event) => {
      if (event.type === 'food' && event.kcal) {
        acc.kcal += event.kcal;
        
        if (event.macros) {
          acc.protein += event.macros.protein || 0;
          acc.carbs += event.macros.carbs || 0;
          acc.fat += event.macros.fat || 0;
        }
      } else if (event.type === 'water' && event.qty) {
        acc.water += event.qty;
      }
      
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, water: 0 }
  );
  
  // Filter events by meal type
  const getEventsByMeal = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    return events.filter(event => event.type === 'food' && event.meal === meal);
  };
  
  // Get water events
  const waterEvents = events.filter(event => event.type === 'water');
  
  // Get exercise events
  const exerciseEvents = events.filter(event => event.type === 'exercise');
  
  // Navigate to assistant with prefilled intent
  const askGuaco = (meal: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    navigate(`/assistant?intent=track&meal=${meal}&date=${selectedDate}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeDate(-1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold">
          {selectedDate === today ? 'Today' : format(parseISO(selectedDate), 'MMMM d, yyyy')}
        </h2>
        
        <button
          onClick={() => changeDate(1)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Daily Summary */}
      <Card className="mb-6 p-4">
        <h3 className="text-xl font-semibold mb-2">Daily Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-gray-500">Calories</p>
            <p className="text-2xl font-bold">{totals.kcal}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Protein</p>
            <p className="text-2xl font-bold">{totals.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Carbs</p>
            <p className="text-2xl font-bold">{totals.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Fat</p>
            <p className="text-2xl font-bold">{totals.fat}g</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Water</p>
            <p className="text-2xl font-bold">{totals.water} / {WATER_GOAL} ml</p>
          </div>
        </div>
      </Card>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Meals */}
          {['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => (
            <MealSection
              key={meal}
              title={meal.charAt(0).toUpperCase() + meal.slice(1)}
              meal={meal as 'breakfast' | 'lunch' | 'dinner' | 'snack'}
              events={getEventsByMeal(meal as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
              onAddClick={() => setActiveModal({ type: 'food', meal: meal as 'breakfast' | 'lunch' | 'dinner' | 'snack' })}
              onAskGuaco={() => askGuaco(meal as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
              onDelete={deleteEvent}
            />
          ))}
          
          {/* Water Tracking */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Water</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => addEvent({ type: 'water', qty: 250, unit: 'ml' })}
                  variant="outline"
                >
                  + 250ml
                </Button>
                <Button 
                  onClick={() => setActiveModal({ type: 'water' })}
                  variant="primary"
                >
                  Add Water
                </Button>
              </div>
            </div>
            
            {/* Water Progress */}
            <div className="flex items-center mb-4">
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-blue-500" 
                  style={{ width: `${Math.min(100, (totals.water / WATER_GOAL) * 100)}%` }}
                ></div>
              </div>
              <span className="ml-2 font-semibold">{Math.round((totals.water / WATER_GOAL) * 100)}%</span>
            </div>
            
            {/* Water Entries */}
            {waterEvents.length > 0 && (
              <ul className="space-y-2">
                {waterEvents.map(event => (
                  <li key={event.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{event.qty} {event.unit}</span>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          
          {/* Exercise Tracking */}
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Exercise</h3>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => setActiveModal({ type: 'exercise' })}
                  variant="primary"
                >
                  Add Activity
                </Button>
              </div>
            </div>
            
            {/* Exercise Entries */}
            {exerciseEvents.length > 0 ? (
              <ul className="space-y-2">
                {exerciseEvents.map(event => (
                  <li key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-gray-500">{event.qty} {event.unit} • {event.kcal ? `${event.kcal} kcal` : 'No calories'}</p>
                      {event.notes && <p className="text-sm italic mt-1">{event.notes}</p>}
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No exercise tracked today</p>
            )}
          </Card>
        </div>
      )}
      
      {/* Modals */}
      {activeModal?.type === 'food' && (
        <TrackFoodModal
          meal={activeModal.meal}
          onClose={() => setActiveModal(null)}
          onSave={(data) => addEvent({ ...data, type: 'food', meal: activeModal.meal })}
        />
      )}
      
      {activeModal?.type === 'water' && (
        <TrackWaterModal
          onClose={() => setActiveModal(null)}
          onSave={(data) => addEvent({ ...data, type: 'water' })}
        />
      )}
      
      {activeModal?.type === 'exercise' && (
        <TrackExerciseModal
          onClose={() => setActiveModal(null)}
          onSave={(data) => addEvent({ ...data, type: 'exercise' })}
        />
      )}
    </div>
  );
};

// Meal Section Component
interface MealSectionProps {
  title: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  events: TrackEvent[];
  onAddClick: () => void;
  onAskGuaco: () => void;
  onDelete: (id: string) => void;
}

const MealSection = ({ title, events, onAddClick, onAskGuaco, onDelete }: MealSectionProps) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex space-x-2">
          <Button 
            onClick={onAskGuaco}
            variant="outline"
          >
            Ask Guaco
          </Button>
          <Button 
            onClick={onAddClick}
            variant="primary"
          >
            Add Item
          </Button>
        </div>
      </div>
      
      {events.length > 0 ? (
        <ul className="space-y-2">
          {events.map(event => (
            <li key={event.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-sm text-gray-500">
                  {event.qty} {event.unit} • {event.kcal} kcal
                  {event.macros && (
                    <span className="ml-1">
                      • P: {event.macros.protein}g C: {event.macros.carbs}g F: {event.macros.fat}g
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => onDelete(event.id)}
                className="text-red-500 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center py-4">No items added</p>
      )}
    </Card>
  );
};

export default Tracker;