import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Globe, Code2, User } from 'lucide-react';
import { aboutData, companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const About: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('about.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('about.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t('about.titleHighlight')}
            </span>
          </h2>
        </motion.div>

        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Left - Story */}
          <motion.div variants={itemVariants} className={isRTL ? 'lg:col-start-2' : ''}>
            <div className="relative">
              {/* Glassmorphism Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-700/50">
                <p className={`text-lg text-slate-300 leading-relaxed mb-8 ${isRTL ? 'text-right' : ''}`}>
                  {t('about.story')}
                </p>

                {/* Founder Info */}
                <div className={`flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h4 className="text-white font-bold text-lg">{aboutData.founder.name}</h4>
                    <p className="text-blue-400 text-sm">{aboutData.founder.role}</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-full blur-2xl" />
            </div>
          </motion.div>

          {/* Right - Features */}
          <motion.div variants={itemVariants} className={`space-y-6 ${isRTL ? 'lg:col-start-1' : ''}`}>
            {/* Languages Card */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('about.languages')}</h3>
                  <p className="text-slate-400">
                    {t('about.languagesList')}
                  </p>
                  <div className={`flex flex-wrap gap-2 mt-4 ${isRTL ? 'justify-end' : ''}`}>
                    {aboutData.founder.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack Card */}
            <motion.div
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Code2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Modern Tech Stack</h3>
                  <p className="text-slate-400 mb-4">
                    Built with the latest technologies for speed, security, and scalability.
                  </p>
                  <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                    {['React', 'TypeScript', 'Node.js', 'Tailwind CSS'].map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Location Badge */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 text-sm font-medium">{companyInfo.location}</span>
              </div>
              <div className="text-slate-600">→</div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-sm font-medium">Soon: {companyInfo.expandingTo}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
