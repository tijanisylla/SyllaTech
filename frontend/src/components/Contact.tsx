import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

const Contact: React.FC = () => {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    business: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Message sent!', { description: "We'll respond within 24 hours." });
    setFormData({ name: '', email: '', business: '', message: '' });
    setIsSubmitting(false);
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
    { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: companyInfo.location, sub: `Expanding to ${companyInfo.expandingTo}` },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', value: companyInfo.email, sub: null },
    { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: companyInfo.phone, sub: null },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]" />

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
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Start Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Project
            </span>
          </h2>
          <p className="text-lg text-slate-400">Ready to take your business online? Let's talk.</p>
        </motion.div>

        <div className={`grid lg:grid-cols-5 gap-10 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Contact Info */}
          <motion.div variants={itemVariants} className={`lg:col-span-2 space-y-4 ${isRTL ? 'lg:col-start-4' : ''}`}>
            {contactInfo.map((info, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{info.label}</p>
                  <p className="text-white font-medium">{info.value}</p>
                  {info.sub && <p className="text-cyan-400 text-sm mt-1">{info.sub}</p>}
                </div>
              </div>
            ))}

            {/* Map */}
            <div className="h-40 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.06]">
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

          {/* Form */}
          <motion.div variants={itemVariants} className={`lg:col-span-3 ${isRTL ? 'lg:col-start-1' : ''}`}>
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={`block text-sm text-slate-400 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all ${isRTL ? 'text-right' : ''}`}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className={`block text-sm text-slate-400 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className={`block text-sm text-slate-400 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  Business Type
                </label>
                <select
                  name="business"
                  value={formData.business}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-cyan-500/50 focus:outline-none transition-all ${isRTL ? 'text-right' : ''}`}
                >
                  <option value="" className="bg-slate-900">Select your business type</option>
                  <option value="auto" className="bg-slate-900">Auto Repair / Car Wash</option>
                  <option value="restaurant" className="bg-slate-900">Restaurant / Cafe</option>
                  <option value="retail" className="bg-slate-900">Retail / E-commerce</option>
                  <option value="service" className="bg-slate-900">Service Business</option>
                  <option value="startup" className="bg-slate-900">Startup / Tech</option>
                  <option value="other" className="bg-slate-900">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className={`block text-sm text-slate-400 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none transition-all resize-none ${isRTL ? 'text-right' : ''}`}
                  placeholder="Tell us about your project..."
                />
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
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
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
