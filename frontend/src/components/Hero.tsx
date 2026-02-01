import React, { useEffect, useRef, useContext } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { companyInfo, stats } from '@/data/mock';
import { BookingContext } from '@/App';

const Hero: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const { openBooking } = useContext(BookingContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      }`} />
      
      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 tech-grid opacity-40" />
      
      {/* Gradient Orbs */}
      <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${
        isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/20'
      }`} />
      <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] ${
        isDark ? 'bg-blue-600/10' : 'bg-blue-600/15'
      }`} />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-32 w-full">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
              isDark 
                ? 'bg-cyan-500/10 border border-cyan-500/20' 
                : 'bg-cyan-50 border border-cyan-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className={`text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              Web Design & Full-Stack Development
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Premium Websites &</span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Full-Stack Apps
            </span>
            <br />
            <span className={isDark ? 'text-white' : 'text-slate-900'}>for Growing Businesses</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-xl md:text-2xl font-medium mb-4 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}
          >
            {companyInfo.subTagline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`text-lg max-w-2xl mx-auto mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            Websites, Web Apps, Emails, and Ads — Built Fast, Built Right. 
            We help local businesses establish a powerful online presence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
          >
            <motion.button
              onClick={() => scrollToSection('#booking')}
              className={`group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              whileHover={{ scale: 1.03, boxShadow: "0 12px 32px rgba(6, 182, 212, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Book Free Consultation
              <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </motion.button>
            
            <motion.button
              onClick={() => scrollToSection('#portfolio')}
              className={`px-8 py-4 font-semibold rounded-xl border transition-all ${
                isDark 
                  ? 'text-white border-white/20 hover:bg-white/5 hover:border-cyan-500/30' 
                  : 'text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-cyan-500'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Demo Projects
            </motion.button>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`text-center p-6 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30' 
                  : 'bg-white/80 border-slate-200 hover:border-cyan-500/50 shadow-sm'
              }`}
              whileHover={{ y: -4, borderColor: "rgba(6, 182, 212, 0.4)" }}
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className={`w-6 h-10 rounded-full border-2 flex justify-center pt-2 ${
          isDark ? 'border-slate-700' : 'border-slate-300'
        }`}>
          <motion.div
            className="w-1.5 h-2.5 bg-cyan-400 rounded-full"
            animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
