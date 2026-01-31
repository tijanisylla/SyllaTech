import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const WhatsAppWidget: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const phoneNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 group`}
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
    >
      {/* Pulse Animation */}
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-emerald-500 animate-ping opacity-30" />
      
      {/* Main Button */}
      <motion.div
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.div>

      {/* Tooltip */}
      <div className={`absolute ${isRTL ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg border border-slate-800`}>
        {t('whatsapp.tooltip')}
        <div className={`absolute ${isRTL ? 'left-0 -translate-x-1' : 'right-0 translate-x-1'} top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-800`} />
      </div>
    </motion.a>
  );
};

export default WhatsAppWidget;
