import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GroceryList from "./pages/GroceryList";
// Assuming GetStarted, Tracker, Recipes, Friends pages exist
// import GetStarted from "./pages/GetStarted";
// import Tracker from "./pages/Tracker";
// import Recipes from "./pages/Recipes";
// import Friends from "./pages/Friends";

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
          {/* Add other routes that need the NavBar here */}
          {/* <Route path="/get-started" element={<GetStarted />} /> */}
          {/* <Route path="/tracker" element={<Tracker />} /> */}
          {/* <Route path="/recipes" element={<Recipes />} /> */}
          {/* <Route path="/friends" element={<Friends />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}