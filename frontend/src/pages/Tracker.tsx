import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import TrackFoodModal from "../components/TrackFoodModal";
import TrackWaterModal from "../components/TrackWaterModal";
import TrackSleepModal from "../components/TrackSleepModal";
import TrackExerciseModal from "../components/TrackExerciseModal";

const cardData = [
  {
    key: "food",
    label: "Food",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-200">
        {/* Food icon (fork & knife) */}
        <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 3v7a2 2 0 002 2h0a2 2 0 002-2V3m0 0v7a2 2 0 002 2h0a2 2 0 002-2V3m0 0v7a2 2 0 002 2h0a2 2 0 002-2V3" /></svg>
      </span>
    ),
    bg: "bg-rose-50",
  },
  {
    key: "water",
    label: "Water",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-200">
        {/* Water icon (droplet) */}
        <svg className="w-6 h-6 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3.25C12 3.25 7 9.25 7 13a5 5 0 0010 0c0-3.75-5-9.75-5-9.75z" /></svg>
      </span>
    ),
    bg: "bg-sky-50",
  },
  {
    key: "sleep",
    label: "Sleep",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-200">
        {/* Sleep icon (moon) */}
        <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
      </span>
    ),
    bg: "bg-indigo-50",
  },
  {
    key: "exercise",
    label: "Exercise",
    icon: (
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-200">
        {/* Exercise icon (dumbbell) */}
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.5 6.5l11 11m-11 0l11-11" /></svg>
      </span>
    ),
    bg: "bg-emerald-50",
  },
];

type ModalKey = "food" | "water" | "sleep" | "exercise" | null;

export default function Tracker() {
  const [openModal, setOpenModal] = useState<ModalKey>(null);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Track Progress</h1>
      <p className="text-gray-500 mb-8">Log your daily food, water, sleep, and exercise to stay on track.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cardData.map(card => (
          <Card
            key={card.key}
            className={`${card.bg} shadow-lg rounded-xl cursor-pointer transition-transform hover:scale-105`}
            onClick={() => setOpenModal(card.key as ModalKey)}
          >
            <div className="flex items-center space-x-4 p-6">
              {card.icon}
              <span className="text-lg font-semibold">{card.label}</span>
            </div>
          </Card>
        ))}
      </div>
      <TrackFoodModal open={openModal === "food"} setOpen={(open: boolean) => setOpenModal(open ? "food" : null)} />
      <TrackWaterModal open={openModal === "water"} setOpen={(open: boolean) => setOpenModal(open ? "water" : null)} />
      <TrackSleepModal open={openModal === "sleep"} setOpen={(open: boolean) => setOpenModal(open ? "sleep" : null)} />
      <TrackExerciseModal open={openModal === "exercise"} setOpen={(open: boolean) => setOpenModal(open ? "exercise" : null)} />
    </div>
  );
}
