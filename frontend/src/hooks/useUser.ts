import { useState } from "react";

export default function useUser() {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("platefulUser") ?? "{}")
  );

  const save = (updates: any) => {
    const next = { ...user, ...updates };
    localStorage.setItem("platefulUser", JSON.stringify(next));
    setUser(next);
  };

  return [user, save];
} 