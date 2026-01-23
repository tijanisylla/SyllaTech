import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#team', label: t('nav.team') },
    { href: '#contact', label: t('nav.contact') },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-xl py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#home');
            }}
            className={`group flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-slate-900 font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              {companyInfo.name.split(' ')[0]}
              <span className="text-amber-400">.</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-white/80 hover:text-amber-400 transition-colors duration-300 text-sm font-medium tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side - Language Switcher & CTA */}
          <div className={`hidden lg:flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageSwitcher />
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#contact');
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25 transform hover:-translate-y-0.5"
            >
              {t('nav.getStarted')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className={`block text-white/90 hover:text-amber-400 transition-colors py-2 text-lg font-medium ${isRTL ? 'text-right' : ''}`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <LanguageSwitcher />
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#contact');
                }}
                className="block w-full text-center px-6 py-3 bg-amber-500 text-slate-900 font-semibold rounded-lg"
              >
                {t('nav.getStarted')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
