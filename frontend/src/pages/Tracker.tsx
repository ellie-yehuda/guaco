import Navigation from "../components/NavBar";
import { Card } from "../components/ui/Card";
import { Apple, Droplets, Moon, Activity } from "lucide-react";
import { useState } from "react";
import FoodTrackingModal from "../components/TrackFoodModal";
import WaterTrackingModal from "../components/TrackWaterModal";
import SleepTrackingModal from "../components/TrackSleepModal";
import ExerciseTrackingModal from "../components/TrackExerciseModal";

const Track = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const greeting = getGreeting();

  const trackingButtons = [
    {
      icon: Apple,
      title: "Food",
      description: "Log your meals and snacks",
      color: "bg-red-500 text-white",
      bgColor: "bg-red-50",
      action: () => setActiveModal("food")
    },
    {
      icon: Droplets,
      title: "Water",
      description: "Track your hydration",
      color: "bg-blue-500 text-white",
      bgColor: "bg-blue-50",
      action: () => setActiveModal("water")
    },
    {
      icon: Moon,
      title: "Sleep",
      description: "Log your sleep hours",
      color: "bg-purple-500 text-white",
      bgColor: "bg-purple-50",
      action: () => setActiveModal("sleep")
    },
    {
      icon: Activity,
      title: "Exercise",
      description: "Record your workouts",
      color: "bg-green-500 text-white",
      bgColor: "bg-green-50",
      action: () => setActiveModal("exercise")
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-white to-blue-50">
      {/* Header */}
      <div className="p-6 pt-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-wellness-mint to-teal-400 mb-2">
          {greeting}, User!
        </h1>
        <p className="text-lg text-gray-700 mt-2">Ready to log your progress?</p>
      </div>

      {/* 2x2 Grid of Tracking Buttons */}
      <div className="px-6 max-w-md mx-auto py-4">
        <div className="grid grid-cols-2 gap-4">
          {trackingButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Card
                key={index}
                className={`p-6 ${button.bgColor} border rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer`}
                onClick={button.action}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-full ${button.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{button.title}</h3>
                    <p className="text-gray-600 text-sm">{button.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <FoodTrackingModal 
        open={activeModal === "food"} 
        setOpen={() => setActiveModal(null)} 
      />
      <WaterTrackingModal 
        open={activeModal === "water"} 
        setOpen={() => setActiveModal(null)} 
      />
      <SleepTrackingModal 
        open={activeModal === "sleep"} 
        setOpen={() => setActiveModal(null)} 
      />
      <ExerciseTrackingModal 
        open={activeModal === "exercise"} 
        setOpen={() => setActiveModal(null)} 
      />

      <Navigation />
    </div>
  );
};

export default Track;
