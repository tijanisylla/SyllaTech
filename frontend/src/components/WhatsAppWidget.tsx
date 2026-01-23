import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const WhatsAppWidget: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const phoneNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(t('whatsapp.message'));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 group`}
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Animation */}
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-green-500 animate-ping opacity-30" />
      
      {/* Main Button */}
      <div className="relative w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Tooltip */}
      <div className={`absolute ${isRTL ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg`}>
        {t('whatsapp.tooltip')}
        <div className={`absolute ${isRTL ? 'left-0 -translate-x-1' : 'right-0 translate-x-1'} top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45`} />
      </div>
    </a>
  );
};

export default WhatsAppWidget;
