import React from 'react';
import { Linkedin, Twitter } from 'lucide-react';
import { team } from '@/data/mock';
import { useLanguage } from '@/context/LanguageContext';

const Team: React.FC = () => {
  const { t, isRTL } = useLanguage();

  const roleKeys: Record<string, string> = {
    'Founder & CEO': 'founderCeo',
    'Creative Director': 'creativeDirector',
    'Lead Developer': 'leadDeveloper',
    'Marketing Manager': 'marketingManager',
    'Brand Strategist': 'brandStrategist',
    'Project Manager': 'projectManager',
  };

  return (
    <section id="team" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold tracking-wide uppercase mb-4">
            {t('team.badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            {t('team.title')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">
              {t('team.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('team.description')}
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Social Links Overlay */}
                <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={isRTL ? 'text-right' : ''}>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-amber-400 text-sm font-medium">
                      {t(`roles.${roleKeys[member.role]}`)}
                    </p>
                  </div>
                  <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-amber-500 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className={`h-1 bg-gradient-to-r from-amber-400 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${isRTL ? 'origin-right' : 'origin-left'}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
