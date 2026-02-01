import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Star, ArrowRight } from 'lucide-react';
import { pricingPlans, monthlyPlan } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { BookingContext } from '@/App';

const Pricing: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const { openBooking } = useContext(BookingContext);
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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#030712]' : 'bg-slate-50'}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] ${
        isDark ? 'bg-cyan-600/5' : 'bg-cyan-600/10'
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
            Transparent Pricing
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Simple{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            No hidden fees. Choose the plan that fits your needs.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              className={`relative ${plan.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
              whileHover={{ y: -6 }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="flex items-center gap-1 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                    <Star className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-full p-6 rounded-2xl border transition-all duration-300 ${
                plan.popular 
                  ? isDark
                    ? 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/30 hover:border-cyan-500/50' 
                    : 'bg-gradient-to-b from-cyan-50 to-white border-cyan-300 hover:border-cyan-400 shadow-lg'
                  : isDark
                    ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30'
                    : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'
              }`}>
                {/* Plan Header */}
                <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{plan.description}</p>
                </div>

                {/* Price */}
                <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                  {plan.price === 'Custom' ? (
                    <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Custom</span>
                  ) : (
                    <>
                      <span className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>$</span>
                      <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                      <span className={`text-sm ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>starting</span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                      <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={openBooking}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : isDark
                        ? 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                        : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-cyan-500/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Plan */}
        <motion.div
          variants={itemVariants}
          className={`p-6 rounded-2xl border ${
            isDark 
              ? 'bg-gradient-to-r from-white/[0.02] to-white/[0.04] border-white/[0.06]' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{monthlyPlan.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  isDark 
                    ? 'bg-teal-500/10 border border-teal-500/20 text-teal-400' 
                    : 'bg-teal-50 border border-teal-200 text-teal-600'
                }`}>
                  Recurring
                </span>
              </div>
              <p className={`text-sm mb-4 lg:mb-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{monthlyPlan.description}</p>
            </div>

            <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : ''}`}>
              {monthlyPlan.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className={`flex items-center gap-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Check className="w-4 h-4 text-teal-500" />
                  {feature}
                </span>
              ))}
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>$</span>
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{monthlyPlan.price}</span>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
              </div>
              <motion.button
                onClick={() => scrollToSection('#booking')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${isRTL ? 'flex-row-reverse' : ''} ${
                  isDark 
                    ? 'bg-teal-500/20 border border-teal-500/30 text-teal-400 hover:bg-teal-500/30' 
                    : 'bg-teal-50 border border-teal-200 text-teal-600 hover:bg-teal-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Pricing;
