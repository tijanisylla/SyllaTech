import React from 'react';
import { MessageCircle } from 'lucide-react';
import { companyInfo } from '../data/mock';

const WhatsAppWidget: React.FC = () => {
  const phoneNumber = companyInfo.whatsapp.replace(/[^0-9]/g, '');
  const message = encodeURIComponent(`Hello! I'm interested in learning more about Sylla Consulting's services.`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse Animation */}
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-green-500 animate-ping opacity-30" />
      
      {/* Main Button */}
      <div className="relative w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300">
        <MessageCircle className="w-7 h-7 text-white" />
      </div>

      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
        Chat with us
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-900 rotate-45" />
      </div>
    </a>
  );
};

export default WhatsAppWidget;
