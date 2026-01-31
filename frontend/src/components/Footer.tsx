import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowUp, Linkedin, Twitter, Github, Heart } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const Footer: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Website Design', href: '#services' },
      { label: 'Web Development', href: '#services' },
      { label: 'Booking Systems', href: '#services' },
      { label: 'Maintenance', href: '#services' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Early Access', href: '#early-access' },
      { label: 'Contact', href: '#contact' },
    ],
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className={`lg:col-span-2 ${isRTL ? 'text-right' : ''}`}>
            <motion.img
              src="https://customer-assets.emergentagent.com/job_sylladigital/artifacts/k3974qhm_LOGO-SYLLA_TECH.png"
              alt="SyllaTech Logo"
              className={`h-10 w-auto mb-6 ${isRTL ? 'mr-auto ml-0' : ''}`}
              whileHover={{ scale: 1.05 }}
            />
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="space-y-3">
              <div className={`flex items-center gap-3 text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{companyInfo.location}</span>
              </div>
              <div className={`flex items-center gap-3 text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{companyInfo.email}</span>
              </div>
              <div className={`flex items-center gap-3 text-slate-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-4 h-4 text-blue-400" />
                <span dir="ltr">{companyInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.services')}</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className={isRTL ? 'text-right' : ''}>
            <h3 className="text-lg font-semibold mb-6 text-white">{t('footer.company')}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/50">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Social Links */}
            <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:bg-blue-500/20 hover:text-blue-400 transition-all duration-300 border border-slate-700/50 hover:border-blue-500/30"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <p className={`text-slate-500 text-sm flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              © {currentYear} {companyInfo.name}. {t('footer.rights')} {t('footer.builtWith')}{' '}
              <Heart className="w-4 h-4 text-red-500 inline" />
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className={`fixed bottom-24 ${isRTL ? 'left-6' : 'right-6'} w-12 h-12 rounded-full bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center text-white hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300 shadow-lg z-40`}
        aria-label="Scroll to top"
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default Footer;
