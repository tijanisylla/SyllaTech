import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code2, Globe, Mail, Image, Shield, Zap, ArrowRight } from 'lucide-react';
import { services } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  mail: <Mail className="w-6 h-6" />,
  image: <Image className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
};

const Services: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-white via-slate-50 to-white'
      }`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] ${
        isDark ? 'bg-blue-600/5' : 'bg-blue-600/10'
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
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
              : 'bg-cyan-50 border border-cyan-200 text-cyan-600'
          }`}>
            {t('services.badge')}
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('services.title')}
            {t('services.titleHighlight') ? (
              <>{' '}<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{t('services.titleHighlight')}</span></>
            ) : null}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${isRTL ? 'text-right' : ''} ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/40' 
                  : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm hover:shadow-lg'
              }`}
              whileHover={{ y: -6, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.3), 0 0 40px rgba(6, 182, 212, 0.1)" : "0 20px 40px rgba(0,0,0,0.08), 0 0 40px rgba(6, 182, 212, 0.08)" }}
            >
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5' 
                  : 'bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5'
              }`} />

              {/* Icon */}
              <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-cyan-500 transition-all ${isRTL ? 'mr-0 ml-auto' : ''} ${
                isDark 
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 group-hover:from-cyan-500/30 group-hover:to-blue-600/30' 
                  : 'bg-gradient-to-br from-cyan-50 to-blue-50 group-hover:from-cyan-100 group-hover:to-blue-100'
              }`}>
                {iconMap[service.icon]}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className={`text-lg font-semibold mb-2 transition-colors ${
                  isDark 
                    ? 'text-white group-hover:text-cyan-400' 
                    : 'text-slate-900 group-hover:text-cyan-600'
                }`}>
                  {service.title}
                </h3>
                <p className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''} ${
                        isDark ? 'text-slate-500' : 'text-slate-500'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-cyan-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
