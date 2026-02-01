import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, ArrowUp, Linkedin, Twitter, Github, Heart } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const Footer: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const links = {
    services: [
      { label: 'Web Apps', href: '#services' },
      { label: 'Business Sites', href: '#services' },
      { label: 'HTML Emails', href: '#services' },
      { label: 'Maintenance', href: '#services' },
    ],
    company: [
      { label: 'About', href: '#about' },
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Contact', href: '#contact' },
    ],
  };

  const socials = [
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Github className="w-5 h-5" />, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className={`border-t ${isDark ? 'bg-[#030712] border-white/[0.06]' : 'bg-slate-50 border-slate-200'}`}>
      <div className="max-w-[1280px] mx-auto px-6 py-16">
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
              Premium web development for businesses that want to grow. Based in Chicago, expanding to Doha.
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
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Services</h4>
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
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Company</h4>
            <ul className="space-y-2">
              {links.company.map((link, idx) => (
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
              © {currentYear} {companyInfo.name}. Built with{' '}
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
