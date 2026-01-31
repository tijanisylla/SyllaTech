import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Palette, Code2, Calendar, Building2, LayoutDashboard, Shield, ArrowRight } from 'lucide-react';
import { services } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const iconMap: Record<string, React.ReactNode> = {
  palette: <Palette className="w-7 h-7" />,
  code: <Code2 className="w-7 h-7" />,
  calendar: <Calendar className="w-7 h-7" />,
  building: <Building2 className="w-7 h-7" />,
  layout: <LayoutDashboard className="w-7 h-7" />,
  shield: <Shield className="w-7 h-7" />,
};

const Services: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section id="services" className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={cardVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('services.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('services.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t('services.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('services.description')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={cardVariants}
              className={`group relative ${isRTL ? 'text-right' : ''}`}
              whileHover={{ y: -8 }}
            >
              <div className="h-full p-8 rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 transition-all duration-500">
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all duration-500" />

                {/* Icon */}
                <motion.div
                  className={`relative w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-all duration-300 ${isRTL ? 'mr-auto ml-0' : ''}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {iconMap[service.icon]}
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-center gap-2 text-slate-300 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <a
                    href="#contact"
                    className={`inline-flex items-center gap-2 text-blue-400 font-medium group/link hover:text-cyan-400 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {t('services.learnMore')}
                    <ArrowRight className={`w-4 h-4 group-hover/link:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover/link:-translate-x-1' : ''}`} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Services;
