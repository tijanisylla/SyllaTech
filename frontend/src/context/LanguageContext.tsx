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
      team: 'Team',
      contact: 'Contact',
      getStarted: 'Get Started'
    },
    hero: {
      badge: 'Digital Excellence in Qatar',
      title1: 'Transforming',
      title2: 'Digital Visions',
      title3: 'Into Reality',
      description: 'Transforming Ideas into Digital Excellence. We craft innovative digital solutions that elevate brands and drive business growth across the Gulf region.',
      cta1: 'Start Your Project',
      cta2: 'View Our Work'
    },
    stats: {
      projects: 'Projects Completed',
      clients: 'Happy Clients',
      experience: 'Years Experience',
      team: 'Team Members'
    },
    about: {
      badge: 'About Us',
      title: 'Why Choose',
      description: 'Founded by Tijani Sylla with a vision to revolutionize digital consulting in the Gulf region, Sylla Consulting has grown to become a trusted partner for businesses seeking innovative digital solutions. Our team combines creativity with technical expertise to deliver exceptional results.',
      mission: 'Our Mission',
      missionText: 'To empower businesses in Qatar and beyond with cutting-edge digital strategies that drive growth, enhance brand visibility, and create meaningful connections with their audiences.',
      vision: 'Our Vision',
      visionText: 'To be the premier digital consulting firm in the Middle East, known for innovation, excellence, and transformative client partnerships that shape the future of digital business.',
      established: 'Est.',
      serving: 'Serving Excellence',
      expertTeam: 'Expert Team',
      professionals: 'Professionals',
      diverseTalents: 'Diverse talents driving innovation',
      basedIn: 'Based in'
    },
    services: {
      badge: 'What We Offer',
      title: 'Our',
      titleHighlight: 'Services',
      description: 'Comprehensive digital solutions tailored to elevate your brand and drive business growth',
      learnMore: 'Learn More',
      webDesign: {
        title: 'Web Design & Development',
        description: 'Creating stunning, responsive websites that captivate audiences and drive conversions.',
        features: ['Custom UI/UX Design', 'Responsive Development', 'E-commerce Solutions', 'CMS Integration']
      },
      branding: {
        title: 'Brand Strategy',
        description: 'Building powerful brand identities that resonate with your target market.',
        features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Positioning']
      },
      digitalMarketing: {
        title: 'Digital Marketing',
        description: 'Data-driven marketing strategies that maximize your ROI and reach.',
        features: ['SEO Optimization', 'PPC Campaigns', 'Content Strategy', 'Analytics & Reporting']
      },
      socialMedia: {
        title: 'Social Media Management',
        description: 'Engaging social presence that builds community and drives engagement.',
        features: ['Content Creation', 'Community Management', 'Influencer Marketing', 'Social Analytics']
      },
      content: {
        title: 'Content Production',
        description: 'High-quality content that tells your story and connects with audiences.',
        features: ['Videography', 'Photography', 'Copywriting', 'Motion Graphics']
      },
      it: {
        title: 'IT Consulting',
        description: 'Strategic technology solutions that optimize your business operations.',
        features: ['System Integration', 'Cloud Solutions', 'Security Consulting', 'Tech Support']
      }
    },
    portfolio: {
      badge: 'Our Work',
      title: 'Featured',
      titleHighlight: 'Portfolio',
      description: 'Explore our latest projects and see how we\'ve helped brands achieve digital excellence',
      viewProject: 'View Project',
      viewAll: 'View All Projects',
      categories: {
        all: 'All',
        webDesign: 'Web Design',
        branding: 'Branding',
        socialMedia: 'Social Media',
        development: 'Development',
        digitalMarketing: 'Digital Marketing',
        contentProduction: 'Content Production'
      }
    },
    team: {
      badge: 'Our Team',
      title: 'Meet The',
      titleHighlight: 'Creative Minds',
      description: 'A talented team of professionals dedicated to bringing your digital vision to life'
    },
    testimonials: {
      badge: 'Testimonials',
      title: 'What Our',
      titleHighlight: 'Clients Say'
    },
    clients: {
      badge: 'Trusted By',
      title: 'Our Major Clients'
    },
    contact: {
      badge: 'Get In Touch',
      title: "Let's Start Your",
      titleHighlight: 'Project',
      description: "Ready to transform your digital presence? We'd love to hear from you.",
      visitUs: 'Visit Us',
      callUs: 'Call Us',
      emailUs: 'Email Us',
      workingHours: 'Working Hours',
      workingHoursValue: 'Sun - Thu: 9:00 AM - 6:00 PM',
      form: {
        name: 'Your Name',
        namePlaceholder: 'John Doe',
        email: 'Email Address',
        emailPlaceholder: 'john@example.com',
        phone: 'Phone Number',
        phonePlaceholder: '+974 1234 5678',
        subject: 'Subject',
        subjectPlaceholder: 'Select a service',
        message: 'Your Message',
        messagePlaceholder: 'Tell us about your project...',
        submit: 'Send Message',
        sending: 'Sending...',
        success: 'Message sent successfully!',
        successDesc: "We'll get back to you within 24 hours."
      },
      services: {
        webDesign: 'Web Design & Development',
        branding: 'Brand Strategy',
        digitalMarketing: 'Digital Marketing',
        socialMedia: 'Social Media Management',
        content: 'Content Production',
        other: 'Other'
      }
    },
    footer: {
      description: 'Transforming digital visions into reality. Your trusted partner for innovative digital solutions in Qatar and beyond.',
      company: 'Company',
      aboutUs: 'About Us',
      ourTeam: 'Our Team',
      careers: 'Careers',
      services: 'Services',
      webDesign: 'Web Design',
      branding: 'Branding',
      digitalMarketing: 'Digital Marketing',
      socialMedia: 'Social Media',
      resources: 'Resources',
      caseStudies: 'Case Studies',
      blog: 'Blog',
      faq: 'FAQ',
      rights: 'All rights reserved.'
    },
    whatsapp: {
      tooltip: 'Chat with us',
      message: "Hello! I'm interested in learning more about Sylla Consulting's services."
    },
    roles: {
      founderCeo: 'Founder & CEO',
      creativeDirector: 'Creative Director',
      leadDeveloper: 'Lead Developer',
      marketingManager: 'Marketing Manager',
      brandStrategist: 'Brand Strategist',
      projectManager: 'Project Manager'
    }
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'من نحن',
      services: 'خدماتنا',
      portfolio: 'أعمالنا',
      team: 'فريقنا',
      contact: 'اتصل بنا',
      getStarted: 'ابدأ الآن'
    },
    hero: {
      badge: 'التميز الرقمي في قطر',
      title1: 'نحوّل',
      title2: 'الرؤى الرقمية',
      title3: 'إلى واقع',
      description: 'نحوّل الأفكار إلى تميز رقمي. نصنع حلولاً رقمية مبتكرة ترتقي بالعلامات التجارية وتدفع نمو الأعمال في منطقة الخليج.',
      cta1: 'ابدأ مشروعك',
      cta2: 'شاهد أعمالنا'
    },
    stats: {
      projects: 'مشروع مكتمل',
      clients: 'عميل سعيد',
      experience: 'سنوات خبرة',
      team: 'عضو فريق'
    },
    about: {
      badge: 'من نحن',
      title: 'لماذا تختار',
      description: 'أسسها تيجاني سيلا برؤية لإحداث ثورة في الاستشارات الرقمية في منطقة الخليج، نمت سيلا للاستشارات لتصبح شريكاً موثوقاً للشركات التي تبحث عن حلول رقمية مبتكرة. يجمع فريقنا بين الإبداع والخبرة التقنية لتقديم نتائج استثنائية.',
      mission: 'مهمتنا',
      missionText: 'تمكين الشركات في قطر وخارجها باستراتيجيات رقمية متطورة تدفع النمو وتعزز ظهور العلامة التجارية وتخلق روابط ذات معنى مع جماهيرها.',
      vision: 'رؤيتنا',
      visionText: 'أن نكون شركة الاستشارات الرقمية الرائدة في الشرق الأوسط، المعروفة بالابتكار والتميز والشراكات التحويلية مع العملاء التي تشكل مستقبل الأعمال الرقمية.',
      established: 'تأسست',
      serving: 'نخدم بتميز',
      expertTeam: 'فريق خبير',
      professionals: 'محترف',
      diverseTalents: 'مواهب متنوعة تقود الابتكار',
      basedIn: 'مقرنا في'
    },
    services: {
      badge: 'ما نقدمه',
      title: '',
      titleHighlight: 'خدماتنا',
      description: 'حلول رقمية شاملة مصممة لرفع مستوى علامتك التجارية ودفع نمو أعمالك',
      learnMore: 'اعرف المزيد',
      webDesign: {
        title: 'تصميم وتطوير المواقع',
        description: 'إنشاء مواقع ويب مذهلة ومتجاوبة تجذب الجماهير وتزيد التحويلات.',
        features: ['تصميم UI/UX مخصص', 'تطوير متجاوب', 'حلول التجارة الإلكترونية', 'تكامل CMS']
      },
      branding: {
        title: 'استراتيجية العلامة التجارية',
        description: 'بناء هويات علامات تجارية قوية تتردد صداها مع سوقك المستهدف.',
        features: ['تصميم الشعار', 'إرشادات العلامة التجارية', 'الهوية البصرية', 'تموضع العلامة التجارية']
      },
      digitalMarketing: {
        title: 'التسويق الرقمي',
        description: 'استراتيجيات تسويق مبنية على البيانات تزيد من عائد الاستثمار والوصول.',
        features: ['تحسين محركات البحث', 'حملات PPC', 'استراتيجية المحتوى', 'التحليلات والتقارير']
      },
      socialMedia: {
        title: 'إدارة وسائل التواصل الاجتماعي',
        description: 'حضور اجتماعي جذاب يبني المجتمع ويزيد التفاعل.',
        features: ['إنشاء المحتوى', 'إدارة المجتمع', 'التسويق عبر المؤثرين', 'تحليلات التواصل الاجتماعي']
      },
      content: {
        title: 'إنتاج المحتوى',
        description: 'محتوى عالي الجودة يروي قصتك ويتواصل مع الجماهير.',
        features: ['التصوير المرئي', 'التصوير الفوتوغرافي', 'كتابة المحتوى', 'الرسوم المتحركة']
      },
      it: {
        title: 'استشارات تكنولوجيا المعلومات',
        description: 'حلول تقنية استراتيجية تحسن عمليات أعمالك.',
        features: ['تكامل الأنظمة', 'حلول السحابة', 'استشارات الأمان', 'الدعم التقني']
      }
    },
    portfolio: {
      badge: 'أعمالنا',
      title: 'معرض',
      titleHighlight: 'الأعمال',
      description: 'استكشف أحدث مشاريعنا وشاهد كيف ساعدنا العلامات التجارية في تحقيق التميز الرقمي',
      viewProject: 'عرض المشروع',
      viewAll: 'عرض جميع المشاريع',
      categories: {
        all: 'الكل',
        webDesign: 'تصميم المواقع',
        branding: 'العلامات التجارية',
        socialMedia: 'التواصل الاجتماعي',
        development: 'التطوير',
        digitalMarketing: 'التسويق الرقمي',
        contentProduction: 'إنتاج المحتوى'
      }
    },
    team: {
      badge: 'فريقنا',
      title: 'تعرف على',
      titleHighlight: 'العقول المبدعة',
      description: 'فريق موهوب من المحترفين مكرس لتحقيق رؤيتك الرقمية'
    },
    testimonials: {
      badge: 'آراء العملاء',
      title: 'ماذا يقول',
      titleHighlight: 'عملاؤنا'
    },
    clients: {
      badge: 'يثقون بنا',
      title: 'عملاؤنا الرئيسيون'
    },
    contact: {
      badge: 'تواصل معنا',
      title: 'لنبدأ',
      titleHighlight: 'مشروعك',
      description: 'هل أنت مستعد لتحويل حضورك الرقمي؟ يسعدنا سماع منك.',
      visitUs: 'زرنا',
      callUs: 'اتصل بنا',
      emailUs: 'راسلنا',
      workingHours: 'ساعات العمل',
      workingHoursValue: 'الأحد - الخميس: 9:00 ص - 6:00 م',
      form: {
        name: 'اسمك',
        namePlaceholder: 'محمد أحمد',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'mohammed@example.com',
        phone: 'رقم الهاتف',
        phonePlaceholder: '+974 1234 5678',
        subject: 'الموضوع',
        subjectPlaceholder: 'اختر خدمة',
        message: 'رسالتك',
        messagePlaceholder: 'أخبرنا عن مشروعك...',
        submit: 'إرسال الرسالة',
        sending: 'جاري الإرسال...',
        success: 'تم إرسال الرسالة بنجاح!',
        successDesc: 'سنرد عليك خلال 24 ساعة.'
      },
      services: {
        webDesign: 'تصميم وتطوير المواقع',
        branding: 'استراتيجية العلامة التجارية',
        digitalMarketing: 'التسويق الرقمي',
        socialMedia: 'إدارة وسائل التواصل الاجتماعي',
        content: 'إنتاج المحتوى',
        other: 'أخرى'
      }
    },
    footer: {
      description: 'نحوّل الرؤى الرقمية إلى واقع. شريكك الموثوق للحلول الرقمية المبتكرة في قطر وخارجها.',
      company: 'الشركة',
      aboutUs: 'من نحن',
      ourTeam: 'فريقنا',
      careers: 'الوظائف',
      services: 'الخدمات',
      webDesign: 'تصميم المواقع',
      branding: 'العلامات التجارية',
      digitalMarketing: 'التسويق الرقمي',
      socialMedia: 'التواصل الاجتماعي',
      resources: 'الموارد',
      caseStudies: 'دراسات الحالة',
      blog: 'المدونة',
      faq: 'الأسئلة الشائعة',
      rights: 'جميع الحقوق محفوظة.'
    },
    whatsapp: {
      tooltip: 'تحدث معنا',
      message: 'مرحباً! أنا مهتم بمعرفة المزيد عن خدمات سيلا للاستشارات.'
    },
    roles: {
      founderCeo: 'المؤسس والرئيس التنفيذي',
      creativeDirector: 'المدير الإبداعي',
      leadDeveloper: 'مطور رئيسي',
      marketingManager: 'مدير التسويق',
      brandStrategist: 'استراتيجي العلامة التجارية',
      projectManager: 'مدير المشاريع'
    }
  }
};
