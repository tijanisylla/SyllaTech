import React, { useState } from "react";
import "@/App.css";
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import About from "@/components/About";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BookingModal from "@/components/BookingModal";

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
      <div className="App min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Toaster position="top-right" richColors theme={isDark ? "dark" : "light"} />
        <Header />
        <main>
          <Hero />
          <Services />
          <TechStack />
          <Portfolio />
          <Pricing />
          <About />
          <Newsletter />
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
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
