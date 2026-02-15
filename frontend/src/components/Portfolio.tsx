import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { demoProjects } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

function useVisibleSlides() {
  const [visible, setVisible] = useState(3);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setVisible(3);
      else if (window.innerWidth >= 768) setVisible(2);
      else setVisible(1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return visible;
}

const Portfolio: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const visibleSlides = useVisibleSlides();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const getGradient = (color: string) => {
    const gradients: Record<string, string> = {
      cyan: 'from-cyan-500 to-blue-500',
      blue: 'from-blue-500 to-purple-500',
      purple: 'from-purple-500 to-pink-500',
      teal: 'from-teal-500 to-cyan-500',
    };
    return gradients[color] || gradients.cyan;
  };

  const totalSlides = demoProjects.length;
  const maxIndex = Math.max(0, totalSlides - visibleSlides);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setActiveIndex(Math.min(index, maxIndex));
  };

  // Translate by one item per step: each item = 100/totalSlides % of content width
  const translateX = isRTL
    ? `${activeIndex * (100 / totalSlides)}%`
    : `-${activeIndex * (100 / totalSlides)}%`;

  // Auto-play carousel (pause on hover)
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, maxIndex]);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-white via-slate-50 to-white'
      }`} />
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] ${
        isDark ? 'bg-purple-600/5' : 'bg-purple-600/10'
      }`} />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1400px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            isDark 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            {t('portfolio.badge')}
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('portfolio.title')}{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t('portfolio.titleHighlight')}
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('portfolio.description')}
          </p>
        </motion.div>

        {/* Carousel Container */}
        <motion.div variants={itemVariants} className="relative">
          {/* Navigation Buttons */}
          <div className={`absolute top-1/2 -translate-y-1/2 z-20 ${isRTL ? '-right-4 md:-right-6' : '-left-4 md:-left-6'}`}>
            <motion.button
              onClick={prevSlide}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white' 
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-lg'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          </div>
          
          <div className={`absolute top-1/2 -translate-y-1/2 z-20 ${isRTL ? '-left-4 md:-left-6' : '-right-4 md:-right-6'}`}>
            <motion.button
              onClick={nextSlide}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 border border-white/10 text-white' 
                  : 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 shadow-lg'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="overflow-hidden mx-8"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div 
              className="flex gap-6"
              animate={{ x: translateX }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {demoProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0"
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={`group h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                      isDark 
                        ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30' 
                        : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm hover:shadow-xl'
                    }`}
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 ${
                        isDark 
                          ? 'bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent' 
                          : 'bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent'
                      }`} />
                      
                      {/* Category Badge */}
                      <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                        <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${getGradient(project.color)} text-white text-xs font-semibold shadow-lg`}>
                          {project.category}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <a 
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]"
                      >
                        <motion.span
                          className={`flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-semibold shadow-xl ${isRTL ? 'flex-row-reverse' : ''}`}
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('portfolio.viewDemo')}
                          <ExternalLink className="w-4 h-4" />
                        </motion.span>
                      </a>
                    </div>

                    {/* Content */}
                    <div className={`p-5 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className={`text-lg font-bold mb-2 transition-colors ${
                        isDark 
                          ? 'text-white group-hover:text-cyan-400' 
                          : 'text-slate-900 group-hover:text-cyan-600'
                      }`}>
                        {project.title}
                      </h3>
                      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                        {project.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              isDark 
                                ? 'bg-white/[0.05] border border-white/[0.08] text-slate-300' 
                                : 'bg-slate-100 border border-slate-200 text-slate-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeIndex === index 
                    ? 'w-8 h-2 bg-gradient-to-r from-cyan-500 to-blue-500' 
                    : `w-2 h-2 ${isDark ? 'bg-white/20 hover:bg-white/40' : 'bg-slate-300 hover:bg-slate-400'}`
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Note */}
        <motion.p
          variants={itemVariants}
          className={`text-center text-sm mt-8 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          * These are demo projects. Your website will be custom-designed for your brand and business needs.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Portfolio;
