import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useLenis } from "@/hooks/useLenis";
import { useGlobalData } from "@/hooks/useGlobalData";
import { Header } from "@/components/Header";
import { StickyBadges } from "@/components/sections/HeroSection";
import Home from "@/routes/Home";
import About from "@/routes/About";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppContent() {
  const { data: globalData } = useGlobalData();

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
