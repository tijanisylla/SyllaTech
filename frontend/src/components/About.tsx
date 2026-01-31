import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, Globe, MessageSquare } from 'lucide-react';
import { aboutData, companyInfo } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const About: React.FC = () => {
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

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[120px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1280px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-medium mb-4">
            About SyllaTech
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Building Digital{' '}
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
        </motion.div>

        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-dense' : ''}`}>
          {/* Story */}
          <motion.div variants={itemVariants} className={isRTL ? 'lg:col-start-2' : ''}>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <p className={`text-lg text-slate-300 leading-relaxed mb-8 ${isRTL ? 'text-right' : ''}`}>
                {aboutData.story}
              </p>

              {/* Location Info */}
              <div className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-slate-300 text-sm">{companyInfo.location}</span>
                </div>
                <span className="text-slate-600">→</span>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-cyan-400 text-sm">Soon: {companyInfo.expandingTo}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder & Languages */}
          <motion.div variants={itemVariants} className={`space-y-6 ${isRTL ? 'lg:col-start-1' : ''}`}>
            {/* Founder Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/30 transition-all">
              <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className={isRTL ? 'text-right' : ''}>
                  <h3 className="text-lg font-semibold text-white">{aboutData.founder.name}</h3>
                  <p className="text-cyan-400 text-sm">{aboutData.founder.role}</p>
                </div>
              </div>
              <p className={`text-slate-400 text-sm ${isRTL ? 'text-right' : ''}`}>
                {aboutData.founder.bio}
              </p>
            </div>

            {/* Languages Card */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-teal-500/30 transition-all">
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-white font-semibold">Multilingual Advantage</h3>
              </div>
              <p className={`text-slate-400 text-sm mb-4 ${isRTL ? 'text-right' : ''}`}>
                We communicate with clients worldwide in their language.
              </p>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {aboutData.founder.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Early Partner CTA */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-white font-semibold">Be an Early Partner</h3>
              </div>
              <p className={`text-slate-400 text-sm mb-4 ${isRTL ? 'text-right' : ''}`}>
                New agency building our client base. Get founding partner pricing and priority support.
              </p>
              <motion.a
                href="#booking"
                className={`inline-flex items-center gap-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                whileHover={{ x: isRTL ? -4 : 4 }}
              >
                Claim Your Spot
                <span className={isRTL ? 'rotate-180' : ''}>→</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
