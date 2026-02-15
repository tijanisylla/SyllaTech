import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowUp, Linkedin, Twitter, Github, Heart, ArrowRight, Sparkles, Check } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { validateNewsletter } from '@/lib/validation';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
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
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg = typeof err.detail === 'string' ? err.detail : 'Submission failed';
        throw new Error(msg);
      }
      toast.success(t('toast.subscribed'), { description: t('toast.subscribedDesc') });
      setIsSubscribed(true);
      setEmail('');
      setErrors({});
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('toast.errorGeneric');
      toast.error(msg.includes('already subscribed') ? t('toast.alreadySubscribed') : msg, {
        description: msg.includes('already subscribed') ? '' : t('toast.errorRetry'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: t('footer.webApps'), href: '#services' },
      { label: t('footer.businessSites'), href: '#services' },
      { label: t('footer.htmlEmails'), href: '#services' },
      { label: t('footer.maintenance'), href: '#services' },
    ],
    company: [
      { label: t('footer.about'), href: '#about' },
      { label: t('footer.portfolio'), href: '#portfolio' },
      { label: t('footer.pricing'), href: '#pricing' },
      { label: t('footer.contact'), href: '#contact' },
      { label: t('footer.privacyPolicy'), href: '/privacy-policy' },
      { label: t('footer.cookiePolicy'), href: '/cookies' },
    ],
  };

  const socials = [
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className={`border-t ${isDark ? 'bg-[#030712] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
      {/* Newsletter Section */}
      <div className={`border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
            <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 ${
                isDark ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'
              }`}>
                <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className={`text-xs font-medium ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('newsletter.badge')}</span>
              </div>
              <h3 className={`text-xl md:text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('newsletter.footerTitle')} <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{t('newsletter.footerTitleHighlight')}</span> {t('newsletter.footerTitleRest')}
              </h3>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('newsletter.footerDesc')}
              </p>
            </div>
            
            <form 
              onSubmit={handleNewsletterSubmit}
              className={`flex flex-col sm:flex-row gap-3 flex-1 max-w-md ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <div className="relative flex-1">
                <Mail className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder={t('newsletter.placeholder')}
                  disabled={isSubscribed}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'footer-email-error' : undefined}
                  className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-xl text-sm border focus:outline-none transition-all ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                  } ${isSubscribed ? 'opacity-50 cursor-not-allowed' : ''} ${errors.email ? 'border-red-500/60' : ''}`}
                />
                {errors.email && <p id="footer-email-error" className="text-red-400 text-sm mt-1">{t(errors.email)}</p>}
              </div>
              <motion.button
                type="submit"
                disabled={isSubmitting || isSubscribed || !email}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${isRTL ? 'flex-row-reverse' : ''} ${
                  isSubscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-purple-500/25'
                } disabled:opacity-70`}
                whileHover={!isSubmitting && !isSubscribed ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting && !isSubscribed ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSubscribed ? (
                  <><Check className="w-4 h-4" /> Subscribed</>
                ) : (
                  <><span>{t('footer.subscribe')}</span> <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} /></>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
            <motion.img
              src={isDark ? "/logo.svg" : "/logo-light.svg"}
              alt="SyllaTech"
              className={`h-8 mb-5 ${isRTL ? 'mr-auto ml-0' : ''}`}
              whileHover={{ scale: 1.02 }}
            />
              <p className={`text-sm mb-6 max-w-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('footer.description')}
              </p>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''} ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span>{companyInfo.location}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''} ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <Mail className="w-4 h-4 text-cyan-500" />
                <span>{companyInfo.email}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''} ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <Phone className="w-4 h-4 text-cyan-500" />
                <span dir="ltr">{companyInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className={isRTL ? 'text-right' : ''}>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('footer.services')}</h4>
            <ul className="space-y-2">
              {links.services.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className={`text-sm transition-colors ${
                    isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                  }`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={isRTL ? 'text-right' : ''}>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('footer.company')}</h4>
            <ul className="space-y-2">
              {links.company.map((link, idx) => (
                <li key={idx}>
                  {link.href.startsWith('/') ? (
                    <Link
                      to={link.href}
                      className={`text-sm transition-colors ${
                        isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a href={link.href} className={`text-sm transition-colors ${
                      isDark ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                    }`}>
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Socials */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {socials.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  aria-label={social.label}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all ${
                    isDark 
                      ? 'bg-white/[0.03] border-white/[0.06] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-cyan-600 hover:border-cyan-500/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <p className={`text-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''} ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
              © {currentYear} {companyInfo.name}. {t('footer.builtWith')}{' '}
              <Heart className="w-4 h-4 text-red-500" />
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} w-11 h-11 rounded-xl border flex items-center justify-center transition-all z-40 ${
          isDark 
            ? 'bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30' 
            : 'bg-white border-slate-200 text-slate-500 hover:text-cyan-600 hover:border-cyan-500/50 shadow-md'
        }`}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;
