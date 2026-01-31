import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Early Access',
      contact: 'Contact',
      bookCall: 'Book Free Call'
    },
    hero: {
      badge: 'Web Design & Development Studio',
      title1: 'Modern Websites',
      title2: 'That Grow',
      title3: 'Your Business',
      subtitle: 'Built in Chicago. Expanding to Doha.',
      description: 'We create stunning, high-performance websites for local businesses. From auto repair shops to restaurants, we help you attract more customers online.',
      cta1: 'Book Free Consultation',
      cta2: 'View Demo Projects'
    },
    about: {
      badge: 'About SyllaTech',
      title: 'Building Digital',
      titleHighlight: 'Excellence',
      story: 'SyllaTech was founded by Tijani Youssouf Sylla with a simple mission: help local businesses thrive in the digital age. Based in Chicago and expanding to Doha, Qatar, we bring Silicon Valley-quality web solutions to businesses that deserve better than cookie-cutter templates.',
      founderTitle: 'Meet the Founder',
      languages: 'Multilingual Advantage',
      languagesList: 'Fluent in English, French, Arabic, Portuguese, and Spanish - we communicate with clients worldwide.'
    },
    services: {
      badge: 'What We Build',
      title: 'Our',
      titleHighlight: 'Services',
      description: 'Everything you need to establish a powerful online presence',
      learnMore: 'Learn More'
    },
    portfolio: {
      badge: 'Demo Projects',
      title: 'What We Can',
      titleHighlight: 'Build For You',
      description: 'Explore our demo projects showcasing what we can create for your business',
      viewDemo: 'View Demo',
      features: 'Key Features'
    },
    earlyAccess: {
      badge: 'Limited Opportunity',
      title: 'Be One of Our',
      titleHighlight: 'First Clients',
      description: "We're a new startup, and that means incredible opportunities for early partners. Get premium web development at founding partner rates.",
      cta: 'Claim Your Spot',
      benefit1: 'Founding Partner Pricing',
      benefit1Desc: 'Lock in special rates as one of our first clients',
      benefit2: 'Priority Support',
      benefit2Desc: 'Direct access to the founder for all your needs',
      benefit3: 'Shape Our Services',
      benefit3Desc: 'Your feedback directly influences our offerings',
      benefit4: 'Long-term Partnership',
      benefit4Desc: 'Grow with us as we expand globally'
    },
    booking: {
      badge: 'Free Consultation',
      title: "Let's Discuss",
      titleHighlight: 'Your Project',
      description: 'Book a free 30-minute call to discuss your business needs. No pressure, no obligation - just a friendly conversation about how we can help.',
      cta: 'Schedule Your Call',
      benefits: ['Free 30-min consultation', 'No obligation', 'Custom quote within 24h']
    },
    contact: {
      badge: 'Get In Touch',
      title: 'Start Your',
      titleHighlight: 'Project',
      description: "Ready to take your business online? Let's talk.",
      location: 'Location',
      chicago: 'Chicago, USA',
      expanding: 'Soon in Doha, Qatar',
      email: 'Email',
      phone: 'Phone',
      form: {
        name: 'Your Name',
        email: 'Email Address',
        business: 'Business Type',
        message: 'Tell us about your project',
        submit: 'Send Message',
        sending: 'Sending...'
      }
    },
    footer: {
      description: 'Modern web development for businesses that want to grow. Based in Chicago, expanding to Doha.',
      services: 'Services',
      company: 'Company',
      connect: 'Connect',
      rights: 'All rights reserved.',
      builtWith: 'Built with'
    },
    whatsapp: {
      tooltip: 'Chat with us',
      message: "Hi! I'm interested in SyllaTech's web development services."
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      portfolio: 'أعمالنا',
      pricing: 'الوصول المبكر',
      contact: 'اتصل بنا',
      bookCall: 'احجز مكالمة مجانية'
    },
    hero: {
      badge: 'استوديو تصميم وتطوير الويب',
      title1: 'مواقع حديثة',
      title2: 'تنمّي',
      title3: 'أعمالك',
      subtitle: 'مقرنا شيكاغو. نتوسع إلى الدوحة.',
      description: 'نصمم مواقع ويب مذهلة وعالية الأداء للشركات المحلية. من ورش السيارات إلى المطاعم، نساعدك على جذب المزيد من العملاء.',
      cta1: 'احجز استشارة مجانية',
      cta2: 'شاهد المشاريع'
    },
    about: {
      badge: 'عن SyllaTech',
      title: 'نبني التميز',
      titleHighlight: 'الرقمي',
      story: 'تأسست SyllaTech على يد تيجاني يوسف سيلا بمهمة بسيطة: مساعدة الشركات المحلية على الازدهار في العصر الرقمي. مقرنا في شيكاغو ونتوسع إلى الدوحة، قطر.',
      founderTitle: 'تعرف على المؤسس',
      languages: 'ميزة تعدد اللغات',
      languagesList: 'نتحدث الإنجليزية والفرنسية والعربية والبرتغالية والإسبانية بطلاقة.'
    },
    services: {
      badge: 'ما نبنيه',
      title: '',
      titleHighlight: 'خدماتنا',
      description: 'كل ما تحتاجه لبناء حضور رقمي قوي',
      learnMore: 'اعرف المزيد'
    },
    portfolio: {
      badge: 'مشاريع تجريبية',
      title: 'ما يمكننا',
      titleHighlight: 'بناؤه لك',
      description: 'استكشف مشاريعنا التجريبية',
      viewDemo: 'عرض المشروع',
      features: 'الميزات الرئيسية'
    },
    earlyAccess: {
      badge: 'فرصة محدودة',
      title: 'كن أحد',
      titleHighlight: 'عملائنا الأوائل',
      description: 'نحن شركة ناشئة جديدة، وهذا يعني فرصًا مذهلة للشركاء الأوائل.',
      cta: 'احجز مكانك',
      benefit1: 'أسعار الشركاء المؤسسين',
      benefit1Desc: 'احصل على أسعار خاصة كأحد عملائنا الأوائل',
      benefit2: 'دعم ذو أولوية',
      benefit2Desc: 'تواصل مباشر مع المؤسس',
      benefit3: 'شكّل خدماتنا',
      benefit3Desc: 'ملاحظاتك تؤثر مباشرة على عروضنا',
      benefit4: 'شراكة طويلة الأمد',
      benefit4Desc: 'انمُ معنا أثناء توسعنا عالمياً'
    },
    booking: {
      badge: 'استشارة مجانية',
      title: 'لنناقش',
      titleHighlight: 'مشروعك',
      description: 'احجز مكالمة مجانية لمدة 30 دقيقة لمناقشة احتياجات عملك.',
      cta: 'جدولة مكالمتك',
      benefits: ['استشارة مجانية 30 دقيقة', 'بدون التزام', 'عرض سعر خلال 24 ساعة']
    },
    contact: {
      badge: 'تواصل معنا',
      title: 'ابدأ',
      titleHighlight: 'مشروعك',
      description: 'مستعد لنقل عملك للإنترنت؟ لنتحدث.',
      location: 'الموقع',
      chicago: 'شيكاغو، الولايات المتحدة',
      expanding: 'قريباً في الدوحة، قطر',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      form: {
        name: 'اسمك',
        email: 'البريد الإلكتروني',
        business: 'نوع العمل',
        message: 'أخبرنا عن مشروعك',
        submit: 'إرسال الرسالة',
        sending: 'جاري الإرسال...'
      }
    },
    footer: {
      description: 'تطوير ويب حديث للشركات التي تريد النمو. مقرنا شيكاغو، نتوسع للدوحة.',
      services: 'الخدمات',
      company: 'الشركة',
      connect: 'تواصل',
      rights: 'جميع الحقوق محفوظة.',
      builtWith: 'صُنع بـ'
    },
    whatsapp: {
      tooltip: 'تحدث معنا',
      message: 'مرحباً! أنا مهتم بخدمات SyllaTech لتطوير الويب.'
    }
  }
};
