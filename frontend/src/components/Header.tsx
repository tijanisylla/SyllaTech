import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

// Sparkle component for hover effects
const Sparkle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <motion.span
    className="absolute pointer-events-none"
    style={style}
    initial={{ scale: 0, opacity: 1 }}
    animate={{ scale: 1, opacity: 0 }}
    exit={{ scale: 0, opacity: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
        fill="url(#sparkleGradient)"
      />
      <defs>
        <linearGradient id="sparkleGradient" x1="0" y1="0" x2="12" y2="12">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  </motion.span>
);

// Nav Link with sparkle effect
const NavLink: React.FC<{
  href: string;
  label: string;
  onClick: (href: string) => void;
}> = ({ href, label, onClick }) => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isHovered) return;
    
    // Throttle sparkle creation
    const now = Date.now();
    if (Math.random() > 0.3) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSparkle = { id: now, x, y };
    setSparkles(prev => [...prev.slice(-3), newSparkle]);
    
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 600);
  }, [isHovered]);

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick(href);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="nav-link relative px-3 py-2 text-slate-300 hover:text-white transition-all duration-300 text-sm font-medium group"
    >
      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            style={{
              left: sparkle.x - 6,
              top: sparkle.y - 6,
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-lg bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-300" />
      
      {/* Text */}
      <span className="relative z-10 group-hover:text-shadow-glow">{label}</span>
      
      {/* Underline */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-4/5 transition-all duration-300 rounded-full" />
    </a>
  );
};

// CTA Button with sparkle effect
const CTAButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const positions = [
      { x: 10, y: 5 },
      { x: rect.width - 15, y: 8 },
      { x: rect.width / 2, y: -5 },
      { x: 15, y: rect.height - 5 },
      { x: rect.width - 20, y: rect.height - 8 },
    ];
    
    positions.forEach((pos, i) => {
      setTimeout(() => {
        const newSparkle = { id: Date.now() + i, ...pos };
        setSparkles(prev => [...prev, newSparkle]);
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
        }, 800);
      }, i * 80);
    });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className="cta-button relative overflow-hidden px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Sparkles */}
      <AnimatePresence>
        {sparkles.map(sparkle => (
          <Sparkle
            key={sparkle.id}
            style={{
              left: sparkle.x - 6,
              top: sparkle.y - 6,
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Glow overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/30 to-blue-400/0 opacity-0 hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] hover:translate-x-[100%]" 
        style={{ animation: 'shimmer 2s infinite' }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL, language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 30);
      // Calculate scroll progress for dynamic effects (0-1)
      setScrollProgress(Math.min(scrollY / 200, 1));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#portfolio', label: t('nav.portfolio') },
    { href: '#early-access', label: t('nav.pricing') },
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

  // Dynamic blur based on scroll
  const blurAmount = 12 + scrollProgress * 8; // 12px to 20px
  const bgOpacity = 0.7 + scrollProgress * 0.15; // 0.7 to 0.85

  return (
    <>
      {/* CSS for animations */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .nav-link, .cta-button, .logo-float {
            animation: none !important;
            transition: opacity 0.2s ease !important;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(6, 182, 212, 0.1); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(6, 182, 212, 0.2); }
        }
        
        .logo-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .cta-button:hover {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        
        .text-shadow-glow {
          text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(6, 182, 212, 0.3);
        }
        
        .glass-nav {
          background: rgba(10, 20, 40, var(--bg-opacity, 0.7));
          backdrop-filter: blur(var(--blur-amount, 12px));
          -webkit-backdrop-filter: blur(var(--blur-amount, 12px));
        }
        
        .nav-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          opacity: 0;
          background: radial-gradient(circle at center, rgba(59, 130, 246, 0.15), transparent 70%);
          transition: opacity 0.3s ease;
        }
        
        .nav-link:hover::before {
          opacity: 1;
        }
      `}</style>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          ['--blur-amount' as string]: `${blurAmount}px`,
          ['--bg-opacity' as string]: bgOpacity,
        }}
      >
        <div 
          className={`glass-nav mx-4 mt-3 rounded-xl border border-white/10 shadow-lg shadow-black/20 transition-all duration-500 ${
            isScrolled ? 'py-2' : 'py-3'
          }`}
          style={{
            boxShadow: isScrolled 
              ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
              : '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
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
                <motion.div
                  className="logo-float"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="https://customer-assets.emergentagent.com/job_sylladigital/artifacts/k3974qhm_LOGO-SYLLA_TECH.png"
                    alt="SyllaTech Logo"
                    className={`transition-all duration-300 ${isScrolled ? 'h-8' : 'h-9'}`}
                  />
                </motion.div>
              </a>

              {/* Desktop Navigation */}
              <div className={`hidden lg:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    onClick={scrollToSection}
                  />
                ))}
              </div>

              {/* Right Side */}
              <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Language Toggle */}
                <motion.button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {language === 'en' ? 'العربية' : 'English'}
                  </span>
                </motion.button>

                {/* CTA Button */}
                <CTAButton onClick={() => scrollToSection('#booking')}>
                  {t('nav.bookCall')}
                </CTAButton>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={26} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={26} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </nav>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="lg:hidden mx-4 mt-2"
            >
              <div 
                className="glass-nav rounded-xl border border-white/10 p-5 shadow-xl"
                style={{
                  background: 'rgba(10, 20, 40, 0.85)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className={`block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-base font-medium ${isRTL ? 'text-right' : ''}`}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
                
                <div className="mt-5 pt-5 border-t border-white/10 space-y-3">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    {language === 'en' ? 'العربية' : 'English'}
                  </button>
                  <button
                    onClick={() => scrollToSection('#booking')}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20"
                  >
                    {t('nav.bookCall')}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
