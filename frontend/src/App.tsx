import React from "react";
import "@/App.css";
import { Toaster } from '@/components/ui/sonner';
import { LanguageProvider } from '@/context/LanguageContext';

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

function App() {
  return (
    <LanguageProvider>
      <div className="App bg-[#030712] min-h-screen">
        <Toaster position="top-right" richColors theme="dark" />
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
    </LanguageProvider>
  );
}

export default App;
