import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const q = searchParams.get('email');
    if (q) setEmail(q);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to unsubscribe');
      }
      setStatus('success');
      setMessage("You've been unsubscribed. You won't receive marketing emails from us anymore.");
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/80 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Unsubscribe</h1>
        <p className="text-slate-400 text-sm mb-6">
          Enter your email to stop receiving marketing emails from SyllaTech.
        </p>

        {status === 'success' ? (
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4">
            <p className="text-emerald-400 font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              disabled={status === 'loading'}
            />
            {message && status === 'error' && (
              <p className="text-sm text-red-400">{message}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 text-sm">
            ← Back to SyllaTech
          </a>
        </p>
      </div>
    </div>
  );
};

export default Unsubscribe;
