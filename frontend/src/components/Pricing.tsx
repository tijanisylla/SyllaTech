import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Star, ArrowRight } from 'lucide-react';
import { pricingPlans, monthlyPlan } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const Pricing: React.FC = () => {
  const { isRTL } = useLanguage();
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
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[150px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            Transparent Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Simple{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
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
                  ? 'bg-gradient-to-b from-cyan-500/10 to-transparent border-cyan-500/30 hover:border-cyan-500/50' 
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30'
              }`}>
                {/* Plan Header */}
                <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
                  {plan.price === 'Custom' ? (
                    <span className="text-3xl font-bold text-white">Custom</span>
                  ) : (
                    <>
                      <span className="text-slate-400 text-lg">$</span>
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-slate-400 text-sm ml-1">starting</span>
                    </>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <motion.button
                  onClick={() => scrollToSection('#booking')}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                      : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
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
          className="p-6 rounded-2xl bg-gradient-to-r from-white/[0.02] to-white/[0.04] border border-white/[0.06]"
        >
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={isRTL ? 'text-right' : ''}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-white">{monthlyPlan.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium">
                  Recurring
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-4 lg:mb-0">{monthlyPlan.description}</p>
            </div>

            <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : ''}`}>
              {monthlyPlan.features.slice(0, 3).map((feature, idx) => (
                <span key={idx} className="flex items-center gap-1 text-slate-300 text-sm">
                  <Check className="w-4 h-4 text-teal-400" />
                  {feature}
                </span>
              ))}
            </div>

            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-left' : 'text-right'}>
                <span className="text-slate-400 text-sm">$</span>
                <span className="text-3xl font-bold text-white">{monthlyPlan.price}</span>
                <span className="text-slate-400 text-sm">/mo</span>
              </div>
              <motion.button
                onClick={() => scrollToSection('#booking')}
                className={`flex items-center gap-2 px-5 py-2.5 bg-teal-500/20 border border-teal-500/30 rounded-xl text-teal-400 font-semibold hover:bg-teal-500/30 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
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
