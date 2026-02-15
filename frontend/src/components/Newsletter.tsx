import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, ArrowRight, Sparkles, Check } from 'lucide-react';
import { validateNewsletter } from '@/lib/validation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const Newsletter: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    const errs = validateNewsletter(email);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${apiUrl}/api/submissions/newsletter`, {
        method: 'POST',
        body: JSON.stringify({ email: email.trim() }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = typeof data.detail === 'string' ? data.detail : 'Submission failed';
        throw new Error(msg);
      }
      toast.success(t('toast.subscribed'), {
        description: t('toast.subscribedDesc'),
      });
      setIsSubscribed(true);
      setEmail('');
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('toast.errorGeneric');
      toast.error(msg.includes('already subscribed') ? t('toast.alreadySubscribed') : msg, {
        description: msg.includes('already subscribed') ? '' : t('toast.errorRetry'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [t('newsletter.benefit1'), t('newsletter.benefit2'), t('newsletter.benefit3')];

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
                {t('newsletter.badge')}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={itemVariants}
              className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t('newsletter.title')}{' '}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t('newsletter.titleHighlight')}
              </span>{' '}
              {t('newsletter.titleRest')}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className={`text-base md:text-lg mb-6 max-w-lg ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {t('newsletter.description')}
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
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder={t('newsletter.placeholder')}
                  disabled={isSubscribed}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-xl border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  } ${isSubscribed ? 'opacity-50 cursor-not-allowed' : ''} ${errors.email ? 'border-red-500/60' : ''}`}
                />
                {errors.email && <p id="newsletter-email-error" className="text-red-400 text-sm mt-1">{t(errors.email)}</p>}
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
                    {t('newsletter.subscribing')}
                  </>
                ) : isSubscribed ? (
                  <>
                    <Check className="w-5 h-5" />
                    {t('newsletter.subscribed')}
                  </>
                ) : (
                  <>
                    {t('newsletter.subscribe')}
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
              {t('newsletter.privacy')}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Newsletter;
