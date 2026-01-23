import React, { useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const Contact: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success(t('contact.form.success'), {
      description: t('contact.form.successDesc')
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact.visitUs'),
      details: [companyInfo.address],
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.callUs'),
      details: [companyInfo.phone],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact.emailUs'),
      details: [companyInfo.email],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('contact.workingHours'),
      details: [t('contact.workingHoursValue')],
    },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('contact.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('contact.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
              {t('contact.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </div>

        <div className={`grid lg:grid-cols-5 gap-12 ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Contact Info */}
          <div className={`lg:col-span-2 space-y-6 ${isRTL ? 'lg:col-start-4' : ''}`}>
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{info.title}</h3>
                  {info.details.map((detail, i) => (
                    <p key={i} className="text-slate-600 text-sm">{detail}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Map Placeholder */}
            <div className="relative h-48 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115481.45098844709!2d51.43770729726562!3d25.28544660000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e45c534ffdce87f%3A0x1cfa88cf812b4f68!2sDoha%2C%20Qatar!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Doha, Qatar Map"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`lg:col-span-3 ${isRTL ? 'lg:col-start-1' : ''}`}>
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('contact.form.namePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('contact.form.emailPlaceholder')}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 ${isRTL ? 'text-right' : ''}`}
                    placeholder={t('contact.form.phonePlaceholder')}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                    {t('contact.form.subject')} *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    dir={isRTL ? 'rtl' : 'ltr'}
                    className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 bg-white ${isRTL ? 'text-right' : ''}`}
                  >
                    <option value="">{t('contact.form.subjectPlaceholder')}</option>
                    <option value="web-design">{t('contact.services.webDesign')}</option>
                    <option value="branding">{t('contact.services.branding')}</option>
                    <option value="digital-marketing">{t('contact.services.digitalMarketing')}</option>
                    <option value="social-media">{t('contact.services.socialMedia')}</option>
                    <option value="content">{t('contact.services.content')}</option>
                    <option value="other">{t('contact.services.other')}</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className={`block text-sm font-medium text-slate-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all duration-200 resize-none ${isRTL ? 'text-right' : ''}`}
                  placeholder={t('contact.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1 disabled:transform-none disabled:shadow-none ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.form.submit')}
                    <Send className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
