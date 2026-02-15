import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '@/context/CookieConsentContext';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

const CookieConsentBanner: React.FC = () => {
  const { consent, acceptAll, rejectAll } = useCookieConsent();
  const { t } = useLanguage();
  const { isDark } = useTheme();

  if (consent !== null) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 shadow-2xl ${
          isDark
            ? 'bg-slate-900/95 border-t border-white/[0.08] backdrop-blur-xl'
            : 'bg-white/95 border-t border-slate-200 backdrop-blur-xl'
        }`}
      >
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-xl shrink-0 ${isDark ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
              <Cookie className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            </div>
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('cookies.title')}
              </p>
              <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('cookies.description')}{' '}
                <Link
                  to="/privacy-policy"
                  className="text-cyan-500 hover:text-cyan-400 underline"
                >
                  {t('cookies.privacyPolicy')}
                </Link>
                {' · '}
                <Link to="/cookies" className="text-cyan-500 hover:text-cyan-400 underline">
                  {t('cookies.cookiePolicy')}
                </Link>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={rejectAll}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white border border-white/10 hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {t('cookies.reject')}
            </button>
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90 transition-opacity"
            >
              {t('cookies.accept')}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CookieConsentBanner;
