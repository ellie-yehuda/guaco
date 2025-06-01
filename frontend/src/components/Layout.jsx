import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import TopDropdown from "./TopDropdown";

const Layout = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("platefulUser") || "{}");
    if (saved.name) setName(saved.name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("platefulUser");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-white text-gray-900 font-sans flex flex-col pb-32">
      <NavBar name={name} handleLogout={handleLogout} />
      <TopDropdown />
      <Outlet />
    </div>
  );
};

export default Layout; 