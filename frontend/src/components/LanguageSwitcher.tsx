import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-amber-500/50 transition-all duration-300"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4 text-amber-400" />
      <span className="text-sm font-medium text-white">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
