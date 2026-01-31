import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const WhatsAppWidget: React.FC = () => {
  const { isRTL } = useLanguage();
  const phoneNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent("Hi! I'm interested in SyllaTech's web development services.");
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
      {/* Pulse */}
      <div className="absolute inset-0 w-12 h-12 rounded-xl bg-emerald-500 animate-ping opacity-25" />
      
      {/* Button */}
      <motion.div
        className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.div>

      {/* Tooltip */}
      <div className={`absolute ${isRTL ? 'left-full ml-3' : 'right-full mr-3'} top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 border border-white/10 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap`}>
        Chat with us
      </div>
    </motion.a>
  );
};

export default WhatsAppWidget;
