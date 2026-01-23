import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { portfolio } from '../data/mock';

const categories = ['All', 'Web Design', 'Branding', 'Social Media', 'Development', 'Digital Marketing', 'Content Production'];

const Portfolio: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPortfolio = activeCategory === 'All'
    ? portfolio
    : portfolio.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold tracking-wide uppercase mb-4">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Featured{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
              Portfolio
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore our latest projects and see how we've helped brands achieve digital excellence
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-2">
                  {item.category}
                </span>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {item.title}
                </h3>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-white hover:text-amber-400 transition-colors font-medium"
                >
                  View Project
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-slate-900">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
