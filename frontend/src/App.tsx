import React from "react";
import "@/App.css";
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';

// Import components
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import EarlyAccess from "@/components/EarlyAccess";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Toaster position="top-right" richColors theme="dark" />
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <EarlyAccess />
          <Booking />
          <Contact />
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </LanguageProvider>
  );
}

export default App;
