import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { techStack } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const TechStack: React.FC = () => {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
  };

  const categories = [
    { key: 'frontend', label: 'Frontend', color: 'cyan' },
    { key: 'backend', label: 'Backend', color: 'blue' },
    { key: 'tools', label: 'Tools', color: 'purple' },
    { key: 'other', label: 'Expertise', color: 'teal' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40',
      blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/40',
      purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:border-purple-500/40',
      teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:bg-teal-500/20 hover:border-teal-500/40',
    };
    return colors[color] || colors.cyan;
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Tech Stack
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tools & Technologies{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              I Use
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Modern, battle-tested technologies for building fast, scalable, and maintainable applications
          </p>
        </motion.div>

        {/* Tech Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.key}
              variants={itemVariants}
              className={`p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] ${isRTL ? 'text-right' : ''}`}
            >
              <h3 className="text-white font-semibold mb-4">{category.label}</h3>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {techStack[category.key as keyof typeof techStack].map((tech, idx) => (
                  <motion.span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-default ${getColorClasses(category.color)}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TechStack;
