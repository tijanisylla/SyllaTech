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
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import Clients from "@/components/Clients";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";

function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <Toaster position="top-right" richColors />
        <Header />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Team />
          <Testimonials />
          <Clients />
          <Contact />
        </main>
        <Footer />
        <WhatsAppWidget />
      </div>
    </LanguageProvider>
  );
}

export default App;
