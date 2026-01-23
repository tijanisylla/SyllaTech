import React from 'react';
import { MapPin, Phone, Mail, ArrowUp, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';
import { companyInfo } from '@/data/mock';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#contact' },
    ],
    services: [
      { label: 'Web Design', href: '#services' },
      { label: 'Branding', href: '#services' },
      { label: 'Digital Marketing', href: '#services' },
      { label: 'Social Media', href: '#services' },
    ],
    resources: [
      { label: 'Portfolio', href: '#portfolio' },
      { label: 'Case Studies', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Instagram className="w-5 h-5" />, href: '#', label: 'Instagram' },
    { icon: <Facebook className="w-5 h-5" />, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-slate-900 font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold">
                {companyInfo.name.split(' ')[0]}
                <span className="text-amber-400">.</span>
              </span>
            </a>
            <p className="text-slate-400 mb-6 leading-relaxed max-w-sm">
              Transforming digital visions into reality. Your trusted partner for innovative digital solutions in Qatar and beyond.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-amber-400" />
                <span>{companyInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Phone className="w-5 h-5 text-amber-400" />
                <span>{companyInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Mail className="w-5 h-5 text-amber-400" />
                <span>{companyInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-amber-400 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-slate-900 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className="text-slate-500 text-sm">
              © {currentYear} {companyInfo.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-white hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 shadow-lg z-40"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
