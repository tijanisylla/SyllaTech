import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Message sent!', { description: "We'll get back to you within 24 hours." });
    setFormData({ name: '', email: '', business: '', message: '' });
    setIsSubmitting(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t('contact.location'),
      primary: t('contact.chicago'),
      secondary: t('contact.expanding')
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: t('contact.email'),
      primary: companyInfo.email,
      secondary: null
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: t('contact.phone'),
      primary: companyInfo.phone,
      secondary: null
    }
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('contact.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t('contact.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-400">{t('contact.description')}</p>
        </motion.div>

        <div className={`grid lg:grid-cols-5 gap-12 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Contact Info */}
          <motion.div variants={itemVariants} className={`lg:col-span-2 space-y-6 ${isRTL ? 'lg:col-start-4' : ''}`}>
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{info.title}</h3>
                  <p className="text-slate-300 text-sm">{info.primary}</p>
                  {info.secondary && (
                    <p className="text-blue-400 text-sm mt-1">{info.secondary}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="relative h-48 rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d380511.7463192055!2d-88.01369644999999!3d41.833733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4cbed%3A0xafe0a6ad09c0c000!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                title="Chicago Map"
              />
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className={`lg:col-span-3 ${isRTL ? 'lg:col-start-1' : ''}`}>
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium text-slate-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium text-slate-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    dir="ltr"
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium text-slate-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('contact.form.business')}
                </label>
                <select
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all ${isRTL ? 'text-right' : ''}`}
                >
                  <option value="">Select your business type</option>
                  <option value="auto">Auto Repair / Car Wash</option>
                  <option value="restaurant">Restaurant / Cafe</option>
                  <option value="retail">Retail Store</option>
                  <option value="service">Service Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium text-slate-300 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('contact.form.message')} *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-white transition-all resize-none ${isRTL ? 'text-right' : ''}`}
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/25 ${isRTL ? 'flex-row-reverse' : ''}`}
                whileHover={{ scale: 1.02 }}
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
