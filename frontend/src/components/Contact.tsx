import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { validateContact } from '@/lib/validation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateContact(formData);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${apiUrl}/api/submissions/contact`, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Submission failed');
      toast.success(t('toast.messageSent'), { description: t('toast.messageSentDesc') });
      setFormData({ name: '', email: '', business: '', message: '' });
      setErrors({});
    } catch {
      toast.error(t('toast.errorGeneric'), {
        description: t('toast.errorRetry'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const contactInfo = [
    { icon: <MapPin className="w-5 h-5" />, label: t('contact.location'), value: companyInfo.location, sub: `${t('contact.expanding')} ${companyInfo.expandingTo}` },
    { icon: <Mail className="w-5 h-5" />, label: t('contact.email'), value: companyInfo.email, sub: null },
    { icon: <Phone className="w-5 h-5" />, label: t('contact.phone'), value: companyInfo.phone, sub: null },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]' 
          : 'bg-gradient-to-b from-white via-slate-50 to-white'
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
            {t('contact.badge')}
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('contact.title')}{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {t('contact.titleHighlight')}
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t('contact.description')}</p>
        </motion.div>

        <div className={`grid lg:grid-cols-5 gap-10 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Contact Info */}
          <motion.div variants={itemVariants} className={`lg:col-span-2 space-y-4 ${isRTL ? 'lg:col-start-4' : ''}`}>
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-5 rounded-xl border transition-all ${isRTL ? 'flex-row-reverse text-right' : ''} ${
                  isDark 
                    ? 'bg-white/[0.02] border-white/[0.06] hover:border-cyan-500/30' 
                    : 'bg-white border-slate-200 hover:border-cyan-500/50 shadow-sm'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'
                }`}>
                  {info.icon}
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{info.label}</p>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{info.value}</p>
                  {info.sub && <p className={`text-sm mt-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{info.sub}</p>}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className={`h-40 rounded-xl overflow-hidden border ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-slate-200'
            }`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d380511.7463192055!2d-88.01369644999999!3d41.833733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: isDark ? 'invert(90%) hue-rotate(180deg)' : 'none' }}
                allowFullScreen
                loading="lazy"
                title="Chicago Map"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={itemVariants} className={`lg:col-span-3 ${isRTL ? 'lg:col-start-1' : ''}`}>
            <form
              onSubmit={handleSubmit}
              className={`p-8 rounded-2xl border ${
                isDark 
                  ? 'bg-white/[0.02] border-white/[0.06]' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${isRTL ? 'text-right' : ''} ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                    } ${errors.name ? 'border-red-500/60' : ''}`}
                    placeholder={t('contact.form.placeholderName')}
                  />
                  {errors.name && <p id="name-error" className="text-red-400 text-sm mt-1">{t(errors.name)}</p>}
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                    } ${errors.email ? 'border-red-500/60' : ''}`}
                    placeholder={t('contact.form.placeholderEmail')}
                  />
                  {errors.email && <p id="email-error" className="text-red-400 text-sm mt-1">{t(errors.email)}</p>}
                </div>
              </div>

              <div className="mb-5">
                <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('contact.form.business')}
                </label>
                <select
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${isRTL ? 'text-right' : ''} ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white focus:border-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500'
                  }`}
                >
                  <option value="" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.selectBusiness')}</option>
                  <option value="auto" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessAuto')}</option>
                  <option value="restaurant" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessRestaurant')}</option>
                  <option value="retail" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessRetail')}</option>
                  <option value="service" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessService')}</option>
                  <option value="startup" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessStartup')}</option>
                  <option value="other" className={isDark ? 'bg-slate-900' : 'bg-white'}>{t('contact.form.businessOther')}</option>
                </select>
              </div>

              <div className="mb-6">
                <label className={`block text-sm mb-2 ${isRTL ? 'text-right' : ''} ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all resize-none ${isRTL ? 'text-right' : ''} ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  } ${errors.message ? 'border-red-500/60' : ''}`}
                  placeholder={t('contact.form.placeholderMessage')}
                />
                {errors.message && <p id="message-error" className="text-red-400 text-sm mt-1">{t(errors.message)}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(6, 182, 212, 0.35)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.form.submit')}
                    <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
