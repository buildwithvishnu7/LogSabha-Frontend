import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLenis } from "@/hooks/useLenis";
import { useGlobalData } from "@/hooks/useGlobalData";
import { fetchMe } from "@/services/auth";
import { Header } from "@/components/Header";
import { StickyBadges } from "@/components/sections/HeroSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "@/routes/Home";
import About from "@/routes/About";
import Login from "@/routes/Login";
import Signup from "@/routes/Signup";
import Account from "@/routes/Account";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { data: globalData } = useGlobalData();

  // Validate any persisted session once on load (refreshes /me, or clears it).
  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <>
      <Header />
      {globalData && <StickyBadges badges={globalData.sideBadges} />}
      <AnimatedRoutes />
    </>
  );
}

function App() {
  useLenis();

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
