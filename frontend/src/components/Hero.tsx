import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { companyInfo, stats } from '@/data/mock';

const Hero: React.FC = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800/50 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-amber-400 text-sm font-medium tracking-wide">
              Digital Excellence in Qatar
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-6">
            <span className="block">Transforming</span>
            <span className="block mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-teal-400">
                Digital Visions
              </span>
            </span>
            <span className="block mt-2">Into Reality</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            {companyInfo.tagline}. We craft innovative digital solutions that elevate brands
            and drive business growth across the Gulf region.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => scrollToSection('#contact')}
              className="group flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/30 transform hover:-translate-y-1"
            >
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('#portfolio')}
              className="group flex items-center gap-3 px-8 py-4 border-2 border-slate-600 hover:border-amber-500 text-white font-semibold rounded-xl transition-all duration-300 hover:bg-amber-500/10"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              View Our Work
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-amber-500/30 transition-all duration-300 hover:transform hover:-translate-y-1"
            >
              <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-amber-400 rounded-full animate-scroll" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
