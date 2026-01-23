import React from 'react';
import { clients } from '@/data/mock';

const Clients: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold tracking-wide uppercase mb-4">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Our Major Clients
          </h2>
        </div>

        {/* Clients Marquee */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="flex animate-marquee">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 mx-8"
              >
                <div className="w-32 h-32 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 hover:border-slate-200 transition-all duration-300 hover:transform hover:scale-105">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center mb-2">
                      <span className="text-xl font-bold text-amber-400">
                        {client.logo}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[100px]">
                      {client.name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
