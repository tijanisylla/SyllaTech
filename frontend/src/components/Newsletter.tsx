import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const Newsletter: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Subscribed!', { 
      description: 'Welcome to the SyllaTech newsletter!' 
    });
    
    setIsSubmitting(false);
    setIsSubscribed(true);
    setEmail('');
  };

  const benefits = [
    'Web development tips & trends',
    'Exclusive early-bird discounts',
    'Free resources & templates'
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-slate-50 via-white to-slate-50'
      }`} />
      
      {/* Gradient orbs */}
      <div className={`absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px] ${
        isDark ? 'bg-purple-600/10' : 'bg-purple-600/10'
      }`} />
      <div className={`absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px] ${
        isDark ? 'bg-cyan-600/10' : 'bg-cyan-600/10'
      }`} />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[800px] mx-auto px-6"
      >
        <motion.div
          variants={itemVariants}
          className={`relative p-8 md:p-12 rounded-3xl border overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-white/[0.04] to-white/[0.01] border-white/[0.08]' 
              : 'bg-white border-slate-200 shadow-xl'
          }`}
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            {/* Icon */}
            <motion.div
              variants={itemVariants}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 ${
                isDark 
                  ? 'bg-purple-500/10 border border-purple-500/20' 
                  : 'bg-purple-50 border border-purple-200'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Newsletter
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Stay{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Ahead
              </span>{' '}
              of the Curve
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className={`text-base md:text-lg mb-6 max-w-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Join our newsletter for web development insights, exclusive offers, and free resources delivered to your inbox.
            </motion.p>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
              {benefits.map((benefit, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'
                  }`}>
                    <Check className={`w-3 h-3 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                  </div>
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Form */}
            <motion.form
              variants={itemVariants}
              onSubmit={handleSubmit}
              className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <div className="relative flex-1">
                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isSubscribed}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-xl border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  } ${isSubscribed ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              
              <motion.button
                type="submit"
                disabled={isSubmitting || isSubscribed || !email}
                className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''} ${
                  isSubscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                } disabled:opacity-70`}
                whileHover={!isSubmitting && !isSubscribed ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !isSubscribed ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Subscribing...
                  </>
                ) : isSubscribed ? (
                  <>
                    <Check className="w-5 h-5" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Privacy note */}
            <motion.p
              variants={itemVariants}
              className={`text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
            >
              No spam, ever. Unsubscribe anytime.
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
