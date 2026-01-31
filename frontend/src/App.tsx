import React from "react";
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
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  
  return (
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
        <Booking />
        <Contact />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
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
