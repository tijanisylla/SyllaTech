import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Percent, Headphones, MessageSquare, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const EarlyAccess: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const benefits = [
    {
      icon: <Percent className="w-6 h-6" />,
      title: t('earlyAccess.benefit1'),
      description: t('earlyAccess.benefit1Desc'),
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: t('earlyAccess.benefit2'),
      description: t('earlyAccess.benefit2Desc'),
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('earlyAccess.benefit3'),
      description: t('earlyAccess.benefit3Desc'),
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: t('earlyAccess.benefit4'),
      description: t('earlyAccess.benefit4Desc'),
      color: 'from-amber-500 to-orange-500'
    }
  ];

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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="early-access" className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Main Card */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 overflow-hidden"
        >
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full" />

          <div className="relative p-8 md:p-12 lg:p-16">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
              {/* Left Content */}
              <div className={isRTL ? 'lg:col-start-2 text-right' : ''}>
                <motion.div
                  variants={itemVariants}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-semibold">{t('earlyAccess.badge')}</span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                  {t('earlyAccess.title')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                    {t('earlyAccess.titleHighlight')}
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-lg text-slate-400 mb-8 leading-relaxed"
                >
                  {t('earlyAccess.description')}
                </motion.p>

                <motion.button
                  variants={itemVariants}
                  onClick={() => scrollToSection('#booking')}
                  className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/25 ${isRTL ? 'flex-row-reverse' : ''}`}
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('earlyAccess.cta')}
                  <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                </motion.button>
              </div>

              {/* Right - Benefits Grid */}
              <div className={`grid sm:grid-cols-2 gap-4 ${isRTL ? 'lg:col-start-1' : ''}`}>
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${benefit.color} bg-opacity-20 flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white">{benefit.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-slate-500 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EarlyAccess;
