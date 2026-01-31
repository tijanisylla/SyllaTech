import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink } from 'lucide-react';
import { demoProjects } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const Portfolio: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
    };
    return gradients[color] || gradients.cyan;
  };

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
        className="relative z-10 max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            isDark 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            Demo Projects
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Sample{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Showcasing what we can build for your business. Each project is a template that can be customized to your brand.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {demoProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group"
              whileHover={{ y: -8 }}
            >
              <div className={`h-full rounded-2xl border overflow-hidden transition-all duration-300 ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30' 
                  : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm hover:shadow-lg'
              }`}>
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${
                    isDark 
                      ? 'bg-gradient-to-t from-[#030712] via-transparent to-transparent' 
                      : 'bg-gradient-to-t from-slate-900/60 via-transparent to-transparent'
                  }`} />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getGradient(project.color)} text-white text-xs font-medium`}>
                      {project.category}
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm">
                    <motion.button
                      className={`flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Demo
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-5 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                    isDark 
                      ? 'text-white group-hover:text-cyan-400' 
                      : 'text-slate-900 group-hover:text-cyan-600'
                  }`}>
                    {project.title}
                  </h3>
                  <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-md text-xs ${
                          isDark 
                            ? 'bg-white/[0.04] border border-white/[0.08] text-slate-400' 
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
        </div>

        {/* Note */}
        <motion.p
          variants={itemVariants}
          className={`text-center text-sm mt-10 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
        >
          * These are demo projects. Your website will be custom-designed for your brand and business needs.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Portfolio;
