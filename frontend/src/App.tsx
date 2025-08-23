import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Welcome from "./pages/Welcome";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ErrorBoundary from "./components/ErrorBoundary";
import { ToastProvider } from "./context/ToastContext";
import { Suspense, lazy } from "react";

// Lazy load some pages for performance
const LazyGroceryList = lazy(() => import("./pages/GroceryList"));
const LazyRecipes = lazy(() => import("./pages/Recipes"));
const LazyRecipeNew = lazy(() => import("./pages/RecipeNew"));
const LazyRecipeAI = lazy(() => import("./pages/RecipeAI"));
const LazyRecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const LazyTracker = lazy(() => import("./pages/Tracker"));
const LazyAssistant = lazy(() => import("./pages/Assistant"));

// Loading fallback for lazy loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            {/* Routes that use the NavBar layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            <Route 
              path="/grocery" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyGroceryList />
                </Suspense>
              } 
            />
            <Route 
              path="/recipes" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyRecipes />
                </Suspense>
              } 
            />
            <Route 
              path="/recipes/category/:categoryId" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyRecipes />
                </Suspense>
              } 
            />
            <Route 
              path="/recipes/new" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyRecipeNew />
                </Suspense>
              } 
            />
            <Route 
              path="/recipes/ai" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyRecipeAI />
                </Suspense>
              } 
            />
            <Route 
              path="/recipes/:id" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyRecipeDetail />
                </Suspense>
              } 
            />
            <Route 
              path="/tracker" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyTracker />
                </Suspense>
              } 
            />
            <Route 
              path="/assistant" 
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <LazyAssistant />
                </Suspense>
              } 
            />
          </Route>
          {/* Fallback route for 404 */}
          <Route path="*" element={
            <div className="flex items-center justify-center h-screen flex-col">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="mb-8">The page you're looking for doesn't exist.</p>
              <a href="/" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}