import React, { useState, useEffect } from 'react';
import { Mail, Calendar, MessageSquare, LogOut, RefreshCw, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const ADMIN_STORAGE_KEY = 'syllatech_admin_key';

type Tab = 'newsletter' | 'bookings' | 'contact';

interface NewsletterItem {
  id: string;
  email: string;
  timestamp: string;
}

interface BookingItem {
  id: string;
  date?: string;
  time?: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  message?: string;
  timestamp: string;
}

interface ContactItem {
  id: string;
  name: string;
  email: string;
  business?: string;
  message: string;
  timestamp: string;
}

const Admin: React.FC = () => {
  const [key, setKey] = useState('');
  const [storedKey, setStoredKey] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_STORAGE_KEY)
  );
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('newsletter');
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState<NewsletterItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [contact, setContact] = useState<ContactItem[]>([]);

  const fetchData = async (apiKey: string) => {
    setLoading(true);
    setError('');
    try {
      const [newsRes, bookRes, contactRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/submissions?type=newsletter`, {
          headers: { 'x-api-key': apiKey },
        }),
        fetch(`${API_BASE}/api/admin/submissions?type=bookings`, {
          headers: { 'x-api-key': apiKey },
        }),
        fetch(`${API_BASE}/api/admin/submissions?type=contact`, {
          headers: { 'x-api-key': apiKey },
        }),
      ]);
      if (newsRes.status === 401 || bookRes.status === 401 || contactRes.status === 401) {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setStoredKey(null);
        setError('Invalid key');
        return;
      }
      const newsData = await newsRes.json();
      const bookData = await bookRes.json();
      const contactData = await contactRes.json();
      setNewsletter(newsData.items || []);
      setBookings(bookData.items || []);
      setContact(contactData.items || []);
    } catch (e) {
      setError('Failed to load. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storedKey) {
      fetchData(storedKey);
    }
  }, [storedKey]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    sessionStorage.setItem(ADMIN_STORAGE_KEY, key);
    setStoredKey(key);
    setKey('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setStoredKey(null);
  };

  const formatDate = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return ts;
    }
  };

  if (!storedKey) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm p-8 rounded-2xl border border-slate-700 bg-slate-900/50 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">SyllaTech Admin</h1>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Enter your admin secret key to view submissions.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Admin key"
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-4"
            />
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'newsletter', label: 'Newsletter', icon: <Mail className="w-4 h-4" />, count: newsletter.length },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" />, count: bookings.length },
    { id: 'contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" />, count: contact.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            SyllaTech Admin
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => storedKey && fetchData(storedKey)}
              disabled={loading}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-1 border-t border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 -mb-px",
                activeTab === tab.id
                  ? "text-cyan-400 border-cyan-500"
                  : "text-slate-500 border-transparent hover:text-slate-300"
              )}
            >
              {tab.icon}
              {tab.label}
              <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-slate-800 text-slate-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-12 text-center text-slate-500">
                        No newsletter signups yet
                      </td>
                    </tr>
                  ) : (
                    newsletter.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">{item.email}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(item.timestamp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date & Time</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                        No bookings yet
                      </td>
                    </tr>
                  ) : (
                    bookings.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">{item.name}</td>
                        <td className="px-4 py-3 text-slate-300">{item.email}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm">
                          {item.date} {item.time}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{item.business || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Business</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Message</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contact.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                        No contact submissions yet
                      </td>
                    </tr>
                  ) : (
                    contact.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">{item.name}</td>
                        <td className="px-4 py-3 text-slate-300">{item.email}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{item.business || '—'}</td>
                        <td className="px-4 py-3 text-slate-400 text-sm max-w-xs truncate">{item.message}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(item.timestamp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
