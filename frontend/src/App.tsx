import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { CookieConsentProvider, useCookieConsent } from '@/context/CookieConsentContext';

// Components
import Header from "@/components/Header";
import Admin from "@/components/Admin";
import Unsubscribe from "@/components/Unsubscribe";
import PrivacyPolicy from "@/components/PrivacyPolicy";
import CookiePolicy from "@/components/CookiePolicy";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BookingModal from "@/components/BookingModal";
import NotFound from "@/components/NotFound";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const TrackVisits: React.FC = () => {
  const { pathname } = useLocation();
  const { hasAnalyticsConsent } = useCookieConsent();
  useEffect(() => {
    if (!hasAnalyticsConsent || pathname === "/admin" || pathname === "/unsubscribe") return;
    fetch(`${API_BASE}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname || "/" }),
    }).catch(() => {});
  }, [pathname, hasAnalyticsConsent]);
  return null;
};

// Create a context for the booking modal
export const BookingContext = React.createContext<{
  openBooking: () => void;
  closeBooking: () => void;
}>({
  openBooking: () => {},
  closeBooking: () => {},
});

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);
  
  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      <TrackVisits />
      <div className="App min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Header />
        <main>
          <Hero />
          <Services />
          <TechStack />
          <Portfolio />
          <Pricing />
          <About />
          <Contact />
        </main>
        <Footer />
        <WhatsAppWidget />
        <BookingModal isOpen={isBookingOpen} onClose={closeBooking} />
      </div>
    </BookingContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CookieConsentProvider>
          <Toaster position="top-right" richColors theme="dark" />
          <BrowserRouter>
            <Routes>
              <Route path="/admin" element={<Admin />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/" element={<AppContent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsentBanner />
          </BrowserRouter>
        </CookieConsentProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
