import React from 'react';
import { Target, Eye, Award, Users } from 'lucide-react';
import { aboutData, companyInfo } from '@/data/mock';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold tracking-wide uppercase mb-4">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
              {companyInfo.name}
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {aboutData.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Image/Visual */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center">
                    <Award className="w-7 h-7 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Est. {companyInfo.established}</p>
                    <p className="text-white/70 text-sm">Serving Excellence</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl p-6 shadow-xl max-w-xs hidden lg:block">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Expert Team</p>
                  <p className="text-sm text-slate-500">25+ Professionals</p>
                </div>
              </div>
              <p className="text-slate-600 text-sm">
                Diverse talents driving innovation
              </p>
            </div>
          </div>

          {/* Right Side - Mission & Vision */}
          <div className="space-y-8">
            {/* Mission */}
            <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {aboutData.mission}
                  </p>
                </div>
              </div>
            </div>

            {/* Vision */}
            <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Vision</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {aboutData.vision}
                  </p>
                </div>
              </div>
            </div>

            {/* Location Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900 rounded-full">
              <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white font-medium">Based in {companyInfo.location}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
