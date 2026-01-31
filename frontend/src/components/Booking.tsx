import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, CheckCircle, Video } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Booking: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const benefits = [
    'Free 30-min consultation',
    'No obligation',
    'Custom quote within 24h'
  ];

  return (
    <section id="booking" className="py-24 lg:py-32 bg-slate-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-5xl mx-auto px-6 lg:px-8 relative z-10"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('booking.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('booking.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              {t('booking.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('booking.description')}
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 backdrop-blur-xl border border-slate-700/50 overflow-hidden"
        >
          <div className={`grid md:grid-cols-2 gap-8 p-8 md:p-12 ${isRTL ? 'md:grid-flow-dense' : ''}`}>
            {/* Left - Info */}
            <div className={isRTL ? 'md:col-start-2 text-right' : ''}>
              <div className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Free Discovery Call</h3>
                  <p className="text-slate-500 text-sm">30-minute video consultation</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* What to Expect */}
              <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <h4 className={`text-white font-semibold mb-3 ${isRTL ? 'text-right' : ''}`}>What to Expect:</h4>
                <ul className={`space-y-2 text-slate-400 text-sm ${isRTL ? 'text-right' : ''}`}>
                  <li>• Discuss your business goals</li>
                  <li>• Explore website options</li>
                  <li>• Get a timeline estimate</li>
                  <li>• Receive a custom quote</li>
                </ul>
              </div>
            </div>

            {/* Right - CTA */}
            <div className={`flex flex-col justify-center ${isRTL ? 'md:col-start-1' : ''}`}>
              <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                <Calendar className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                <h4 className="text-2xl font-bold text-white mb-2">Ready to Start?</h4>
                <p className="text-slate-400 mb-6">
                  Pick a time that works for you
                </p>
                <motion.a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-blue-500/25"
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Clock className="w-5 h-5" />
                  {t('booking.cta')}
                </motion.a>
                <p className="text-slate-500 text-xs mt-4">
                  * Or email us at hello@syllatech.com
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Booking;
