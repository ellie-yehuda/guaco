import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GroceryList from "./pages/GroceryList";
import Recipes from "./pages/Recipes";
import Tracker from "./pages/Tracker";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/onboarding" element={<Onboarding />} />
        {/* Routes that use the NavBar layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/grocery" element={<GroceryList />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/tracker" element={<Tracker />} />
        </Route>
      </Routes>
    </Router>
  );
}