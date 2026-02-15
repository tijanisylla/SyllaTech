import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Globe, MessageSquare } from 'lucide-react';
import { aboutData, companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const About: React.FC = () => {
  const { t, isRTL } = useLanguage();
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-white via-slate-50 to-white'
      }`} />
      <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] ${
        isDark ? 'bg-teal-600/5' : 'bg-teal-600/10'
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
              ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' 
              : 'bg-teal-50 border border-teal-200 text-teal-600'
          }`}>
            {t('about.badge')}
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('about.title')}{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              {t('about.titleHighlight')}
            </span>
          </h2>
        </motion.div>

        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Story */}
          <motion.div variants={itemVariants} className={isRTL ? 'lg:col-start-2' : ''}>
            <div className={`p-8 rounded-2xl border ${
              isDark 
                ? 'bg-white/[0.02] border-white/[0.06]' 
                : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <p className={`text-lg leading-relaxed mb-8 ${isRTL ? 'text-right' : ''} ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {t('about.story')}
              </p>

              {/* Location Info */}
              <div className={`flex items-center gap-4 p-4 rounded-xl ${isRTL ? 'flex-row-reverse' : ''} ${
                isDark 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20' 
                  : 'bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{companyInfo.location}</span>
                </div>
                <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>→</span>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className={`text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{t('about.soon')}: {companyInfo.expandingTo}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder & Languages */}
          <motion.div variants={itemVariants} className={`space-y-6 ${isRTL ? 'lg:col-start-1' : ''}`}>
            {/* Founder Card */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark 
                ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30' 
                : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'
            }`}>
              <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-cyan-500/30">
                  <img 
                    src="https://placehold.co/128x128/0ea5e9/white?text=Photo" 
                    alt={aboutData.founder.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{aboutData.founder.name}</h3>
                  <p className={isDark ? 'text-cyan-400' : 'text-cyan-600'} style={{ fontSize: '0.875rem' }}>{t('about.founderRole')}</p>
                </div>
              </div>
              <p className={`text-sm ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('about.founderBio')}
              </p>
            </div>

            {/* Languages Card */}
            <div className={`p-6 rounded-2xl border transition-all ${
              isDark 
                ? 'bg-white/[0.02] border-white/[0.06] hover:border-teal-500/30' 
                : 'bg-white border-slate-200 hover:border-teal-500/50 shadow-sm'
            }`}>
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-teal-500/20' : 'bg-teal-50'
                }`}>
                  <Globe className="w-5 h-5 text-teal-500" />
                </div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('about.languages')}</h3>
              </div>
              <p className={`text-sm mb-4 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('about.languagesDesc')}
              </p>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {aboutData.founder.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      isDark 
                        ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' 
                        : 'bg-teal-50 border border-teal-200 text-teal-600'
                    }`}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Early Partner CTA */}
            <div className={`p-6 rounded-2xl ${
              isDark 
                ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20' 
                : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
            }`}>
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('about.earlyPartner')}</h3>
              </div>
              <p className={`text-sm mb-4 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('about.earlyPartnerDesc')}
              </p>
              <motion.a
                href="#booking"
                className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${isRTL ? 'flex-row-reverse' : ''} ${
                  isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-500'
                }`}
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                {t('about.claimSpot')}
                <span className={isRTL ? 'rotate-180' : ''}>→</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
