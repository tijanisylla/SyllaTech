import React, { useState } from 'react';
import { Globe, Palette, TrendingUp, Share2, Video, Server, ArrowRight } from 'lucide-react';
import { services } from '@/data/mock';

const iconMap: Record<number, React.ReactNode> = {
  1: <Globe className="w-7 h-7" />,
  2: <Palette className="w-7 h-7" />,
  3: <TrendingUp className="w-7 h-7" />,
  4: <Share2 className="w-7 h-7" />,
  5: <Video className="w-7 h-7" />,
  6: <Server className="w-7 h-7" />,
};

const Services: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="services" className="py-24 lg:py-32 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold tracking-wide uppercase mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-teal-400">
              Services
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to elevate your brand and drive business growth
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-500 hover:transform hover:-translate-y-2"
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              {/* Icon */}
              <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-6 text-slate-900 group-hover:scale-110 transition-transform duration-300">
                {iconMap[service.id]}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-slate-300 text-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-amber-400 font-medium group/link hover:text-amber-300 transition-colors"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
