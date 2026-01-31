import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Video, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const Booking: React.FC = () => {
  const { isRTL } = useLanguage();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const benefits = [
    "Free 30-minute video call",
    "No obligation or pressure",
    "Custom quote within 24 hours",
    "Direct access to founder"
  ];

  return (
    <section id="booking" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#030712]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1000px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            Free Consultation
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Let's Discuss{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Your Project
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Book a free discovery call. We'll discuss your goals and show you how we can help.
          </p>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          variants={itemVariants}
          className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.08]"
        >
          <div className={`grid md:grid-cols-2 gap-10 ${isRTL ? 'md:grid-flow-dense' : ''}`}>
            {/* Left - Info */}
            <div className={isRTL ? 'md:col-start-2' : ''}>
              <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="text-xl font-semibold text-white">Discovery Call</h3>
                  <p className="text-slate-400 text-sm">30-minute video consultation</p>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className={`p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] ${isRTL ? 'text-right' : ''}`}>
                <h4 className="text-white font-medium mb-2">What to Expect:</h4>
                <ul className={`text-slate-400 text-sm space-y-1 ${isRTL ? 'pr-4' : 'pl-4'}`}>
                  <li>• Understand your business goals</li>
                  <li>• Explore website/app options</li>
                  <li>• Get timeline & budget estimate</li>
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
                  className="inline-flex items-center justify-center gap-2 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl transition-all"
                  whileHover={{ scale: 1.02, boxShadow: "0 12px 32px rgba(6, 182, 212, 0.35)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Clock className="w-5 h-5" />
                  Schedule Your Call
                </motion.a>
                <p className="text-slate-500 text-xs mt-4">
                  Or email: hello@syllatech.com
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
