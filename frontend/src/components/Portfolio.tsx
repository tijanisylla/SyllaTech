import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ExternalLink } from 'lucide-react';
import { demoProjects } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const Portfolio: React.FC = () => {
  const { isRTL } = useLanguage();
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
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Demo Projects
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Sample{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
              <div className="h-full rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-cyan-500/30 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />
                  
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
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-slate-400 text-xs"
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
          className="text-center text-slate-500 text-sm mt-10"
        >
          * These are demo projects. Your website will be custom-designed for your brand and business needs.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Portfolio;
