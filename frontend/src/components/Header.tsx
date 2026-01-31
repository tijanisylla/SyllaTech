import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL, language, setLanguage } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* Navbar Container - Aligned with page content */}
      <div className="max-w-[1280px] mx-auto px-6">
        <nav
          className={`mt-4 rounded-2xl border transition-all duration-300 ${
            isScrolled
              ? 'py-3 bg-[rgba(8,12,24,0.92)] border-white/10 shadow-lg shadow-black/20'
              : 'py-4 bg-[rgba(8,12,24,0.88)] border-white/8'
          }`}
          style={{
            backdropFilter: `blur(${isScrolled ? 18 : 14}px)`,
            WebkitBackdropFilter: `blur(${isScrolled ? 18 : 14}px)`,
          }}
        >
          <div className={`flex items-center justify-between px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#home');
              }}
              className="flex items-center"
            >
              <motion.img
                src="https://customer-assets.emergentagent.com/job_sylladigital/artifacts/k3974qhm_LOGO-SYLLA_TECH.png"
                alt="SyllaTech"
                className={`transition-all duration-300 ${isScrolled ? 'h-7' : 'h-8'}`}
                whileHover={{ scale: 1.02 }}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </a>

            {/* Desktop Navigation */}
            <div className={`hidden lg:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="group relative px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200"
                >
                  <span className="relative z-10">{link.label}</span>
                  {/* Hover glow background */}
                  <span className="absolute inset-0 rounded-lg bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all duration-200" />
                  {/* Underline */}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </a>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 hover:border-cyan-500/30 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'en' ? 'AR' : 'EN'}</span>
              </button>

              {/* CTA Button */}
              <motion.button
                onClick={() => scrollToSection('#booking')}
                className="relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(6, 182, 212, 0.35)" }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer effect */}
                <span className="absolute inset-0 -translate-x-full hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                <span className="relative">Book Free Consultation</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background: 'rgba(8, 12, 24, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <div className="p-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all ${isRTL ? 'text-right' : ''}`}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
                
                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                  <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  <button
                    onClick={() => scrollToSection('#booking')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg"
                  >
                    Book Free Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
