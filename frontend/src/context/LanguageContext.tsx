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
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in (value as Record<string, unknown>)) {
        value = (value as Record<string, unknown>)[k];
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

const translations: Record<Language, Record<string, unknown>> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      contact: 'Contact',
      bookCall: 'Book Free Consultation',
    },
    theme: {
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
    },
    hero: {
      badge: 'Web Design & Full-Stack Development',
      title1: 'Premium Websites &',
      title2: 'Full-Stack Apps',
      title3: 'for Growing Businesses',
      subtitle: 'Built in Chicago. Expanding to Doha.',
      description: 'Websites, Web Apps, Emails, and Ads — Built Fast, Built Right. We help local businesses establish a powerful online presence.',
      cta1: 'Book Free Consultation',
      cta2: 'View Demo Projects',
    },
    stats: {
      demoProjects: 'Demo Projects',
      languages: 'Languages',
      dedication: 'Dedication',
      support: 'Support',
    },
    services: {
      badge: 'What We Build',
      title: 'Our',
      titleHighlight: 'Services',
      description: 'Everything you need to establish a powerful online presence and grow your business',
      learnMore: 'Learn More',
    },
    portfolio: {
      badge: 'Demo Projects',
      title: 'Sample',
      titleHighlight: 'Work',
      description: 'Showcasing what we can build for your business. Each project is customized to your brand.',
      viewDemo: 'View Demo',
    },
    pricing: {
      badge: 'Transparent Pricing',
      title: 'Simple',
      titleHighlight: 'Pricing',
      description: 'No hidden fees. Choose the plan that fits your needs.',
      mostPopular: 'Most Popular',
      getStarted: 'Get Started',
      custom: 'Custom',
      starting: 'starting',
      recurring: 'Recurring',
      learnMore: 'Learn More',
      perMonth: '/mo',
    },
    about: {
      badge: 'About SyllaTech',
      title: 'Building Digital',
      titleHighlight: 'Excellence',
      story: "SyllaTech was founded with one mission: deliver Silicon Valley-quality web solutions to businesses that want to grow. We're a new agency building our client base the right way—through quality work, honest communication, and results that speak for themselves.",
      founderRole: 'Founder & Lead Developer',
      founderBio: 'Full-stack developer with a passion for clean code and beautiful design. Bringing a global perspective to every project.',
      languages: 'Multilingual Advantage',
      languagesDesc: 'We communicate with clients worldwide in their language.',
      earlyPartner: 'Be an Early Partner',
      earlyPartnerDesc: 'New agency building our client base. Get founding partner pricing and priority support.',
      claimSpot: 'Claim Your Spot',
      soon: 'Soon',
    },
    contact: {
      badge: 'Get In Touch',
      title: 'Start Your',
      titleHighlight: 'Project',
      description: "Ready to take your business online? Let's talk.",
      location: 'Location',
      expanding: 'Expanding to',
      email: 'Email',
      phone: 'Phone',
      form: {
        name: 'Your Name *',
        email: 'Email *',
        business: 'Business Type',
        message: 'Your Message *',
        submit: 'Send Message',
        sending: 'Sending...',
        placeholderName: 'John Doe',
        placeholderEmail: 'john@example.com',
        placeholderMessage: 'Tell us about your project...',
        selectBusiness: 'Select your business type',
        businessAuto: 'Auto Repair / Car Wash',
        businessRestaurant: 'Restaurant / Cafe',
        businessRetail: 'Retail / E-commerce',
        businessService: 'Service Business',
        businessStartup: 'Startup / Tech',
        businessOther: 'Other',
      },
    },
    newsletter: {
      badge: 'Newsletter',
      title: 'Stay',
      titleHighlight: 'Ahead',
      titleRest: 'of the Curve',
      description: 'Join our newsletter for web development insights, exclusive offers, and free resources delivered to your inbox.',
      benefit1: 'Web development tips & trends',
      benefit2: 'Exclusive early-bird discounts',
      benefit3: 'Free resources & templates',
      placeholder: 'Enter your email',
      subscribe: 'Subscribe',
      subscribing: 'Subscribing...',
      subscribed: 'Subscribed!',
      privacy: 'No spam, ever. Unsubscribe anytime.',
      footerTitle: 'Stay',
      footerTitleHighlight: 'Ahead',
      footerTitleRest: 'of the Curve',
      footerDesc: 'Web tips, exclusive offers, and free resources. No spam.',
    },
    footer: {
      description: 'Premium web development for businesses that want to grow. Based in Chicago, expanding to Doha.',
      services: 'Services',
      company: 'Company',
      webApps: 'Web Apps',
      businessSites: 'Business Sites',
      htmlEmails: 'HTML Emails',
      maintenance: 'Maintenance',
      about: 'About',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      contact: 'Contact',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
      subscribe: 'Subscribe',
      rights: 'All rights reserved.',
      builtWith: 'Built with',
    },
    techStack: {
      badge: 'Tech Stack',
      title: 'Tools & Technologies',
      titleHighlight: 'I Use',
      description: 'Modern, battle-tested technologies for building fast, scalable, and maintainable applications',
      frontend: 'Frontend',
      backend: 'Backend',
      tools: 'Tools',
      expertise: 'Expertise',
    },
    whatsapp: {
      tooltip: 'Chat with us',
      message: "Hi! I'm interested in SyllaTech's web development services.",
    },
    toast: {
      messageSent: 'Message sent!',
      messageSentDesc: "We'll respond within 24 hours.",
      errorGeneric: 'Something went wrong',
      errorRetry: 'Please try again or contact us directly.',
      subscribed: 'Subscribed!',
      subscribedDesc: 'Welcome to the SyllaTech newsletter!',
      alreadySubscribed: 'This email is already subscribed.',
    },
    validation: {
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Enter a valid email address',
      messageRequired: 'Message is required',
    },
    cookies: {
      title: 'We use cookies',
      description: 'We use cookies and similar tech to improve your experience and analyze site traffic.',
      privacyPolicy: 'Privacy Policy',
      cookiePolicy: 'Cookie Policy',
      accept: 'Accept all',
      reject: 'Reject',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      portfolio: 'أعمالنا',
      pricing: 'الأسعار',
      contact: 'اتصل بنا',
      bookCall: 'احجز استشارة مجانية',
    },
    theme: {
      lightMode: 'الوضع الفاتح',
      darkMode: 'الوضع الداكن',
    },
    hero: {
      badge: 'تصميم وتطوير الويب والتطبيقات الكاملة',
      title1: 'مواقع احترافية',
      title2: 'وتطبيقات ويب',
      title3: 'للشركات النامية',
      subtitle: 'مقرنا شيكاغو. نتوسع إلى الدوحة.',
      description: 'مواقع ويب، تطبيقات، بريد إلكتروني وإعلانات — نُبنى بسرعة وبجودة. نساعد الشركات المحلية على بناء حضور قوي على الإنترنت.',
      cta1: 'احجز استشارة مجانية',
      cta2: 'شاهد المشاريع',
    },
    stats: {
      demoProjects: 'مشاريع تجريبية',
      languages: 'لغات',
      dedication: 'التزام',
      support: 'دعم',
    },
    services: {
      badge: 'ما نبنيه',
      title: 'خدماتنا',
      titleHighlight: '',
      description: 'كل ما تحتاجه لبناء حضور قوي على الإنترنت وتنمية عملك',
      learnMore: 'اعرف المزيد',
    },
    portfolio: {
      badge: 'مشاريع تجريبية',
      title: 'عينات',
      titleHighlight: 'من أعمالنا',
      description: 'نعرض ما يمكننا بناؤه لعملك. كل مشروع مصمم وفقاً لهويتك.',
      viewDemo: 'عرض المشروع',
    },
    pricing: {
      badge: 'أسعار شفافة',
      title: 'أسعار',
      titleHighlight: 'بسيطة',
      description: 'بدون رسوم مخفية. اختر الخطة التي تناسبك.',
      mostPopular: 'الأكثر شعبية',
      getStarted: 'ابدأ الآن',
      custom: 'مخصص',
      starting: 'ابتداءً من',
      recurring: 'شهري',
      learnMore: 'اعرف المزيد',
      perMonth: '/شهر',
    },
    about: {
      badge: 'عن SyllaTech',
      title: 'نبني التميز',
      titleHighlight: 'الرقمي',
      story: 'تأسست SyllaTech بمهمة واحدة: تقديم حلول ويب بجودة وادي السليكون للشركات التي تريد النمو. نحن وكالة جديدة تبني قاعدة عملائها بالطريقة الصحيحة—من خلال عمل ذو جودة، تواصل صادق، ونتائج تتحدث عن نفسها.',
      founderRole: 'المؤسس والمطور الرئيسي',
      founderBio: 'مطور Full-stack شغوف بالكود النظيف والتصميم الجميل. نقدم منظوراً عالمياً لكل مشروع.',
      languages: 'ميزة تعدد اللغات',
      languagesDesc: 'نتواصل مع العملاء حول العالم بلغتهم.',
      earlyPartner: 'كن شريكاً مبكراً',
      earlyPartnerDesc: 'وكالة جديدة تبني قاعدة عملائها. احصل على أسعار الشركاء المؤسسين ودعم ذو أولوية.',
      claimSpot: 'احجز مكانك',
      soon: 'قريباً',
    },
    contact: {
      badge: 'تواصل معنا',
      title: 'ابدأ',
      titleHighlight: 'مشروعك',
      description: 'مستعد لنقل عملك للإنترنت؟ لنتحدث.',
      location: 'الموقع',
      expanding: 'نتوسع إلى',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      form: {
        name: 'اسمك *',
        email: 'البريد الإلكتروني *',
        business: 'نوع العمل',
        message: 'رسالتك *',
        submit: 'إرسال الرسالة',
        sending: 'جاري الإرسال...',
        placeholderName: 'أحمد محمد',
        placeholderEmail: 'ahmad@example.com',
        placeholderMessage: 'أخبرنا عن مشروعك...',
        selectBusiness: 'اختر نوع عملك',
        businessAuto: 'إصلاح سيارات / غسيل سيارات',
        businessRestaurant: 'مطعم / مقهى',
        businessRetail: 'تجارة / إلكترونية',
        businessService: 'خدمات',
        businessStartup: 'شركة ناشئة / تقنية',
        businessOther: 'أخرى',
      },
    },
    newsletter: {
      badge: 'النشرة الإخبارية',
      title: 'ابقَ',
      titleHighlight: 'متقدماً',
      titleRest: 'على المنافسة',
      description: 'انضم للنشرة الإخبارية لنصائح تطوير الويب، عروض حصرية، وموارد مجانية في بريدك.',
      benefit1: 'نصائح واتجاهات تطوير الويب',
      benefit2: 'خصومات حصرية للمبادرين',
      benefit3: 'موارد وقوالب مجانية',
      placeholder: 'أدخل بريدك الإلكتروني',
      subscribe: 'اشترك',
      subscribing: 'جاري الاشتراك...',
      subscribed: 'تم الاشتراك!',
      privacy: 'بدون إزعاج. يمكنك إلغاء الاشتراك في أي وقت.',
      footerTitle: 'ابقَ',
      footerTitleHighlight: 'متقدماً',
      footerTitleRest: 'على المنافسة',
      footerDesc: 'نصائح ويب، عروض حصرية، وموارد مجانية. بدون إزعاج.',
    },
    footer: {
      description: 'تطوير ويب احترافي للشركات التي تريد النمو. مقرنا شيكاغو، نتوسع للدوحة.',
      services: 'الخدمات',
      company: 'الشركة',
      webApps: 'تطبيقات الويب',
      businessSites: 'مواقع الأعمال',
      htmlEmails: 'بريد HTML',
      maintenance: 'الصيانة',
      about: 'من نحن',
      portfolio: 'أعمالنا',
      pricing: 'الأسعار',
      contact: 'اتصل بنا',
      privacyPolicy: 'سياسة الخصوصية',
      cookiePolicy: 'سياسة ملفات تعريف الارتباط',
      subscribe: 'اشترك',
      rights: 'جميع الحقوق محفوظة.',
      builtWith: 'صُنع بـ',
    },
    techStack: {
      badge: 'التقنيات',
      title: 'أدوات وتقنيات',
      titleHighlight: 'أستخدمها',
      description: 'تقنيات حديثة ومجرّبة لبناء تطبيقات سريعة وقابلة للتوسع',
      frontend: 'الواجهة الأمامية',
      backend: 'الخلفية',
      tools: 'الأدوات',
      expertise: 'الخبرات',
    },
    whatsapp: {
      tooltip: 'تحدث معنا',
      message: 'مرحباً! أنا مهتم بخدمات SyllaTech لتطوير الويب.',
    },
    toast: {
      messageSent: 'تم إرسال الرسالة!',
      messageSentDesc: 'سنرد خلال 24 ساعة.',
      errorGeneric: 'حدث خطأ',
      errorRetry: 'يرجى المحاولة مرة أخرى أو التواصل معنا مباشرة.',
      subscribed: 'تم الاشتراك!',
      subscribedDesc: 'مرحباً بك في نشرة SyllaTech!',
      alreadySubscribed: 'هذا البريد مشترك مسبقاً.',
    },
    validation: {
      nameRequired: 'الاسم مطلوب',
      emailRequired: 'البريد الإلكتروني مطلوب',
      emailInvalid: 'أدخل بريداً إلكترونياً صحيحاً',
      messageRequired: 'الرسالة مطلوبة',
    },
    cookies: {
      title: 'نستخدم ملفات تعريف الارتباط',
      description: 'نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتحسين تجربتك وتحليل حركة الموقع.',
      privacyPolicy: 'سياسة الخصوصية',
      cookiePolicy: 'سياسة ملفات تعريف الارتباط',
      accept: 'قبول الكل',
      reject: 'رفض',
    },
  },
};
