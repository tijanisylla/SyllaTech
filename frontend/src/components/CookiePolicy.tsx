import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const CookiePolicy: React.FC = () => {
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
          Cookie Policy
        </h1>
        <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'} mb-10`}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. What Are Cookies?</h2>
            <p>
              Cookies and similar technologies (e.g. localStorage) are small files stored on your device. We use them to remember your preferences and, with your consent, to analyze how you use our site.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Cookies We Use</h2>
            <table className={`w-full text-left border-collapse ${isDark ? 'border-slate-700' : 'border-slate-300'}`}>
              <thead>
                <tr>
                  <th className={`py-2 pr-4 border-b ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-800 border-slate-300'}`}>Name</th>
                  <th className={`py-2 pr-4 border-b ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-800 border-slate-300'}`}>Purpose</th>
                  <th className={`py-2 border-b ${isDark ? 'text-slate-300 border-slate-700' : 'text-slate-800 border-slate-300'}`}>Type</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 pr-4 border-b border-slate-700/50">syllatech-theme</td>
                  <td className="py-2 pr-4 border-b border-slate-700/50">Stores light/dark mode preference</td>
                  <td className="py-2 border-b border-slate-700/50">Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 border-b border-slate-700/50">language</td>
                  <td className="py-2 pr-4 border-b border-slate-700/50">Stores language preference</td>
                  <td className="py-2 border-b border-slate-700/50">Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 border-b border-slate-700/50">syllatech-cookie-consent</td>
                  <td className="py-2 pr-4 border-b border-slate-700/50">Stores your cookie consent choice</td>
                  <td className="py-2 border-b border-slate-700/50">Necessary</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Visit tracking</td>
                  <td className="py-2 pr-4">Anonymous page views, path, and location for analytics — only when you accept</td>
                  <td className="py-2">Analytics (optional)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Managing Cookies</h2>
            <p>
              You can accept or reject analytics cookies via our cookie banner. Necessary cookies (theme, language, consent) are required for the site to function. You can change your mind at any time by clearing your browser data or revisiting this page when we add a preference center.
            </p>
          </section>

          <section>
            <h2 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>4. Contact</h2>
            <p>
              For questions about our use of cookies, contact us at{' '}
              <a href="mailto:hello@syllatech.com" className="text-cyan-500 hover:text-cyan-400 underline">
                hello@syllatech.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <Link
            to="/privacy-policy"
            className={`text-sm ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'} underline`}
          >
            ← Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
