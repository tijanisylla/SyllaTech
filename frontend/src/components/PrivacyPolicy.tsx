import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { companyInfo } from '@/data/mock';

const PrivacyPolicy: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#030712]' : 'bg-slate-50'}`}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm mb-8 ${
            isDark ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
          } transition-colors`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>

        <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Privacy Policy
        </h1>
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'} mb-10`}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Introduction</h2>
            <p>
              {companyInfo.name} ("we", "our", or "us") respects your privacy. This policy describes how we collect, use, and protect your personal information when you use our website at syllatech.com.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Information We Collect</h2>
            <p className="mb-3">We may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Contact form:</strong> Name, email, business type, and message</li>
              <li><strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Newsletter:</strong> Email address</li>
              <li><strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Bookings:</strong> Name, email, phone, business, date/time preferences, and message</li>
              <li><strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Visit analytics:</strong> Page path, approximate location (country/region/city), and timestamp — only if you accept analytics cookies</li>
              <li><strong className={isDark ? 'text-slate-300' : 'text-slate-800'}>Preferences:</strong> Language and theme settings (stored locally)</li>
            </ul>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. How We Use Your Information</h2>
            <p>
              We use your information to respond to inquiries, send newsletters, manage consultations, improve our services, and analyze site usage (when consented). We do not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Data Retention</h2>
            <p>
              Form submissions and newsletter signups are retained as long as needed for our business operations. You may request deletion by contacting us. Visit data is anonymized and used for analytics only.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>5. Your Rights</h2>
            <p>
              Depending on your location, you may have the right to access, correct, delete, or restrict processing of your data. Newsletter subscribers can unsubscribe at any time via the link in our emails.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>6. Contact</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href={`mailto:${companyInfo.email}`} className="text-cyan-500 hover:text-cyan-400 underline">
                {companyInfo.email}
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            to="/cookies"
            className={`text-sm ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'} underline`}
          >
            View our Cookie Policy →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
