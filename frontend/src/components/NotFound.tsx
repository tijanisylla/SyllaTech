import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
    <h1 className="text-8xl font-bold text-cyan-500/30">404</h1>
    <p className="text-slate-400 mt-4 text-center">Page not found</p>
    <p className="text-slate-500 text-sm mt-2 text-center max-w-md">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <div className="flex gap-4 mt-8">
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
      >
        <Home className="w-4 h-4" /> Home
      </Link>
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  </div>
);

export default NotFound;
