import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { demoProjects } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const Portfolio: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={cardVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('portfolio.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('portfolio.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              {t('portfolio.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('portfolio.description')}
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {demoProjects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group"
              whileHover={{ y: -10 }}
            >
              <div className="h-full rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 overflow-hidden transition-all duration-500">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                    <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${project.color} text-white text-xs font-semibold`}>
                      {project.category}
                    </span>
                  </div>

                  {/* View Demo Button */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ scale: 0.8 }}
                    whileHover={{ scale: 1 }}
                  >
                    <button className={`flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {t('portfolio.viewDemo')}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>

                {/* Content */}
                <div className={`p-6 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    {project.description}
                  </p>

                  {/* Features */}
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{t('portfolio.features')}</p>
                    <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                      {project.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/50 text-slate-300 text-xs ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.p
          variants={cardVariants}
          className="text-center text-slate-500 mt-12 text-sm"
        >
          * These are demo projects showcasing our capabilities. Your website will be custom-designed for your brand.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Portfolio;
