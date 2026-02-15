import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Calendar, MessageSquare, LogOut, RefreshCw, Shield, Eye, EyeOff, Bell, Trash2, Pencil, Send, Users, FileText, BarChart3, Globe, TrendingUp, MapPin, UserMinus, Download, Settings, KeyRound, ArrowLeft, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import CodeEditor from '@uiw/react-textarea-code-editor';
import '@uiw/react-textarea-code-editor/dist.css';

const POLL_INTERVAL_MS = 4000;

const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch {
    // Ignore if audio fails (e.g. autoplay policy)
  }
};

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const ADMIN_STORAGE_KEY = 'syllatech_admin_key';

/** Replace template placeholders with sample values for preview */
const getPreviewHtml = (html: string): string => {
  if (!html?.trim()) return '<p style="padding:1rem;color:#64748b;">Your email preview will appear here.</p>';
  const sampleDate = new Date();
  const dateStr = sampleDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = sampleDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return html
    .replace(/\{\{name\}\}/gi, 'John Doe')
    .replace(/\{\{date\}\}/g, dateStr)
    .replace(/\{\{time\}\}/g, timeStr)
    .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, '#');
};

const HTML_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>SyllaTech</title>
  <style>
    /* Basic mobile safety */
    @media (max-width:600px) {
      .container{width:100%!important;}
      .p{padding:18px!important;}
      .h1{font-size:24px!important;line-height:30px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#030712;">
  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    SyllaTech — Premium web development for growing businesses
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <h1 style="color:#fff;font-size:28px;">Your content here</h1>
        <p style="color:#94a3b8;">Edit this HTML to customize your email.</p>
        <p style="margin-top:24px;font-size:12px;color:#64748b;"><a href="{{UNSUBSCRIBE_URL}}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> from these emails</p>
      </td>
    </tr>
  </table>
</body>
</html>`;

type Tab = 'newsletter' | 'bookings' | 'contact' | 'unsubscribed';

interface NewsletterItem {
  id: string;
  email: string;
  timestamp: string;
}

interface BookingItem {
  id: string;
  date?: string;
  date_iso?: string;
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

interface UnsubscribedItem {
  id: string;
  email: string;
  timestamp: string;
}

const Admin: React.FC = () => {
  const [key, setKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [storedKey, setStoredKey] = useState<string | null>(() =>
    sessionStorage.getItem(ADMIN_STORAGE_KEY)
  );
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('newsletter');
  const [loading, setLoading] = useState(false);
  const [newsletter, setNewsletter] = useState<NewsletterItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [contact, setContact] = useState<ContactItem[]>([]);
  const [unsubscribed, setUnsubscribed] = useState<UnsubscribedItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ type: Tab; id: string; label: string } | null>(null);
  const [editTarget, setEditTarget] = useState<NewsletterItem | BookingItem | ContactItem | UnsubscribedItem | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const prevCountsRef = useRef({ newsletter: 0, bookings: 0, contact: 0, unsubscribed: 0 });
  const isInitialLoadRef = useRef(true);

  // Email campaigns
  const [adminSection, setAdminSection] = useState<'analytics' | 'submissions' | 'email' | 'slots' | 'settings'>('analytics');
  // Analytics
  const [analytics, setAnalytics] = useState<{
    total_visits: number;
    visits_today: number;
    by_country: { country: string; count: number }[];
    by_region: { country: string; region: string; count: number }[];
    recent: { path: string; country: string; region: string; city: string; timestamp: string | null }[];
  } | null>(null);
  const [audiences, setAudiences] = useState<{ id: string; label: string; count: number }[]>([]);
  const [emailForm, setEmailForm] = useState({ audience: '', emailType: 'news', subject: '', htmlBody: '' });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [recipients, setRecipients] = useState<{ email: string; name: string | null }[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());
  // Booking slots config
  const [slotsConfig, setSlotsConfig] = useState<{ time_slots: string[]; blocked_dates: string[]; available_weekdays: number[] } | null>(null);
  const [slotsSaving, setSlotsSaving] = useState(false);
  // Notifications & Change password
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const notificationsPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(e.target as Node)) {
        setShowNotificationsPanel(false);
      }
    };
    if (showNotificationsPanel) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationsPanel]);

  const recentNotifications = (() => {
    const items: { type: 'newsletter' | 'booking' | 'contact'; label: string; detail: string; ts: string; id: string }[] = [];
    newsletter.slice(0, 5).forEach((n) => items.push({ type: 'newsletter', label: 'Newsletter signup', detail: n.email, ts: n.timestamp, id: n.id }));
    bookings.slice(0, 5).forEach((b) => items.push({ type: 'booking', label: 'Booking', detail: `${b.name} – ${b.date || ''} ${b.time || ''}`, ts: b.timestamp, id: b.id }));
    contact.slice(0, 5).forEach((c) => {
      const msg = (c.message || '').slice(0, 40);
      items.push({ type: 'contact', label: 'Contact', detail: `${c.name} – ${msg}${msg.length >= 40 ? '…' : ''}`, ts: c.timestamp, id: c.id });
    });
    return items.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime()).slice(0, 15);
  })();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  // Reply email
  const [replyTarget, setReplyTarget] = useState<{ email: string; name?: string; type: string } | null>(null);
  const [replyForm, setReplyForm] = useState({ subject: '', htmlBody: '' });
  const [replySending, setReplySending] = useState(false);

  const fetchData = async (apiKey: string, isPolling = false) => {
    if (!isPolling) setLoading(true);
    setError('');
    try {
      const [newsRes, bookRes, contactRes, unsubRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/submissions?type=newsletter`, {
          headers: { 'x-api-key': apiKey },
        }),
        fetch(`${API_BASE}/api/admin/submissions?type=bookings`, {
          headers: { 'x-api-key': apiKey },
        }),
        fetch(`${API_BASE}/api/admin/submissions?type=contact`, {
          headers: { 'x-api-key': apiKey },
        }),
        fetch(`${API_BASE}/api/admin/submissions?type=unsubscribed`, {
          headers: { 'x-api-key': apiKey },
        }),
      ]);
      if (newsRes.status === 401 || bookRes.status === 401 || contactRes.status === 401 || unsubRes.status === 401) {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
        setStoredKey(null);
        setError('Invalid key');
        return;
      }
      const newsData = await newsRes.json();
      const bookData = await bookRes.json();
      const contactData = await contactRes.json();
      const unsubData = await unsubRes.json();
      const newNews = newsData.items || [];
      const newBook = bookData.items || [];
      const newContact = contactData.items || [];
      const newUnsub = unsubData.items || [];

      if (!isInitialLoadRef.current) {
        const prev = prevCountsRef.current;
        const addedNews = newNews.length - prev.newsletter;
        const addedBook = newBook.length - prev.bookings;
        const addedContact = newContact.length - prev.contact;
        const hasNew = addedNews > 0 || addedBook > 0 || addedContact > 0;
        if (hasNew) {
          setHasNewNotifications(true);
          playNotificationSound();
          if (addedNews > 0) toast.success(`New newsletter signup`, { description: `${addedNews} new subscriber(s)`, icon: <Bell className="w-4 h-4" /> });
          if (addedBook > 0) toast.success(`New booking${addedBook > 1 ? 's' : ''}`, { description: `${addedBook} new consultation(s)`, icon: <Bell className="w-4 h-4" /> });
          if (addedContact > 0) toast.success(`New contact message${addedContact > 1 ? 's' : ''}`, { description: `${addedContact} new submission(s)`, icon: <Bell className="w-4 h-4" /> });
        }
      }
      isInitialLoadRef.current = false;
      prevCountsRef.current = { newsletter: newNews.length, bookings: newBook.length, contact: newContact.length, unsubscribed: newUnsub.length };

      setNewsletter(newNews);
      setBookings(newBook);
      setContact(newContact);
      setUnsubscribed(newUnsub);
    } catch (e) {
      if (!isPolling) setError('Failed to load. Is the backend running?');
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (storedKey) {
      isInitialLoadRef.current = true;
      fetchData(storedKey);
    }
  }, [storedKey]);

  useEffect(() => {
    if (!storedKey) return;
    const id = setInterval(() => fetchData(storedKey, true), POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [storedKey]);

  const fetchAnalytics = useCallback(() => {
    if (!storedKey) return;
    fetch(`${API_BASE}/api/admin/analytics`, { headers: { 'x-api-key': storedKey } })
      .then((r) => r.json())
      .then((d) => setAnalytics(d))
      .catch(() => setAnalytics(null));
  }, [storedKey]);

  useEffect(() => {
    if (adminSection === 'analytics' && storedKey) {
      fetchAnalytics();
    }
  }, [adminSection, storedKey, fetchAnalytics]);

  const fetchSlotsConfig = useCallback(() => {
    if (!storedKey) return;
    fetch(`${API_BASE}/api/admin/booking/config`, { headers: { 'x-api-key': storedKey } })
      .then((r) => r.json())
      .then(setSlotsConfig)
      .catch(() => setSlotsConfig(null));
  }, [storedKey]);

  useEffect(() => {
    if (adminSection === 'slots' && storedKey) {
      fetchSlotsConfig();
    }
  }, [adminSection, storedKey, fetchSlotsConfig]);

  const handleExport = (type: 'newsletter' | 'bookings' | 'contact') => {
    if (!storedKey) return;
    const url = `${API_BASE}/api/admin/export/${type}`;
    fetch(url, { headers: { 'x-api-key': storedKey } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = type === 'newsletter' ? 'newsletter-subscribers.csv' : type === 'bookings' ? 'bookings.csv' : 'contact-submissions.csv';
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success('Exported');
      })
      .catch(() => toast.error('Export failed'));
  };

  const handleChangePassword = async () => {
    if (!storedKey || !passwordForm.current.trim() || !passwordForm.new.trim()) return;
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new.length < 4) {
      toast.error('Password must be at least 4 characters');
      return;
    }
    setPasswordSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/password`, {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: passwordForm.current, new_password: passwordForm.new }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'Failed to change password');
      }
      toast.success('Password updated');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setStoredKey(passwordForm.new);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, passwordForm.new);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleReplyOpen = (email: string, name?: string, type?: string) => {
    const defaultSubject = type === 'contact' ? 'Re: Your message to SyllaTech' : type === 'booking' ? 'Re: Your consultation with SyllaTech' : 'Message from SyllaTech';
    setReplyTarget({ email, name, type: type || 'newsletter' });
    setReplyForm({ subject: defaultSubject, htmlBody: '' });
  };

  const handleSendReply = async () => {
    if (!replyTarget || !storedKey) return;
    if (!replyForm.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    const html = replyForm.htmlBody.trim() || '<p>No content.</p>';
    setReplySending(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/email/reply`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: replyTarget.email, subject: replyForm.subject.trim(), html_body: html }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail || 'Failed to send');
      }
      toast.success('Email sent');
      setReplyTarget(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send');
    } finally {
      setReplySending(false);
    }
  };

  const saveSlotsConfig = async () => {
    if (!storedKey || !slotsConfig) return;
    setSlotsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/booking/config`, {
        method: 'PUT',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(slotsConfig),
      });
      if (!res.ok) throw new Error('Save failed');
      toast.success('Booking slots updated');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSlotsSaving(false);
    }
  };

  useEffect(() => {
    if (adminSection === 'analytics' && storedKey) {
      const id = setInterval(fetchAnalytics, POLL_INTERVAL_MS);
      return () => clearInterval(id);
    }
  }, [adminSection, storedKey, fetchAnalytics]);

  useEffect(() => {
    if (adminSection === 'email' && storedKey) {
      fetch(`${API_BASE}/api/admin/email/audiences`, { headers: { 'x-api-key': storedKey } })
        .then((r) => r.json())
        .then((d) => setAudiences(d.audiences || []))
        .catch(() => setAudiences([]));
    }
  }, [adminSection, storedKey]);

  useEffect(() => {
    if (adminSection === 'email' && storedKey && emailForm.audience) {
      fetch(
        `${API_BASE}/api/admin/email/recipients?audience=${encodeURIComponent(emailForm.audience)}`,
        { headers: { 'x-api-key': storedKey } }
      )
        .then((r) => r.json())
        .then((d) => {
          const list = d.recipients || [];
          setRecipients(list);
          setSelectedEmails(new Set(list.map((r: { email: string }) => r.email)));
        })
        .catch(() => {
          setRecipients([]);
          setSelectedEmails(new Set());
        });
    } else {
      setRecipients([]);
      setSelectedEmails(new Set());
    }
  }, [adminSection, storedKey, emailForm.audience]);

  const handleSendEmail = async () => {
    if (!storedKey || !emailForm.audience || !emailForm.subject.trim() || !emailForm.htmlBody.trim()) {
      toast.error('Fill audience, subject, and HTML body');
      return;
    }
    setSendingEmail(true);
    try {
      const toSend = Array.from(selectedEmails);
      const res = await fetch(`${API_BASE}/api/admin/email/send`, {
        method: 'POST',
        headers: { ...getHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience: emailForm.audience,
          email_type: emailForm.emailType,
          subject: emailForm.subject,
          html_body: emailForm.htmlBody,
          recipients: toSend.length > 0 ? toSend : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Send failed');
      toast.success('Emails queued', { description: data.message });
      setEmailForm((f) => ({ ...f, subject: '', htmlBody: '' }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to send');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) return;
    sessionStorage.setItem(ADMIN_STORAGE_KEY, trimmed);
    setStoredKey(trimmed);
    setKey('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setStoredKey(null);
  };

  const getHeaders = () => ({ 'x-api-key': storedKey! });

  const handleDelete = async () => {
    if (!deleteTarget || !storedKey) return;
    setActionLoading(true);
    try {
      const idEnc = deleteTarget.type === 'unsubscribed' ? encodeURIComponent(deleteTarget.id) : deleteTarget.id;
      const res = await fetch(
        `${API_BASE}/api/admin/submissions/${deleteTarget.type}/${idEnc}`,
        { method: 'DELETE', headers: getHeaders() }
      );
      if (!res.ok) throw new Error('Delete failed');
      toast.success(deleteTarget.type === 'unsubscribed' ? 'Re-subscribed' : 'Deleted');
      setDeleteTarget(null);
      fetchData(storedKey);
    } catch {
      toast.error('Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditOpen = (item: NewsletterItem | BookingItem | ContactItem) => {
    setEditTarget(item);
    if (activeTab === 'newsletter') {
      setEditForm({ email: (item as NewsletterItem).email });
    } else if (activeTab === 'bookings') {
      const b = item as BookingItem;
      setEditForm({
        date: b.date || '',
        date_iso: b.date_iso || '',
        time: b.time || '',
        name: b.name,
        email: b.email,
        phone: b.phone || '',
        business: b.business || '',
        message: b.message || '',
      });
    } else {
      const c = item as ContactItem;
      setEditForm({
        name: c.name,
        email: c.email,
        business: c.business || '',
        message: c.message,
      });
    }
  };

  const handleEditSave = async () => {
    if (!editTarget || !storedKey) return;
    setActionLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/submissions/${activeTab}/${editTarget.id}`,
        {
          method: 'PUT',
          headers: { ...getHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm),
        }
      );
      if (!res.ok) throw new Error('Update failed');
      toast.success('Updated');
      setEditTarget(null);
      fetchData(storedKey);
    } catch {
      toast.error('Failed to update');
    } finally {
      setActionLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-sm p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.svg" alt="SyllaTech" className="h-8" />
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              Admin
            </span>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Enter your admin secret key to view submissions.
          </p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <input
                type={showPassword ? 'text' : 'password'}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Admin key"
                className="w-full px-4 py-3 pr-12 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              Login
            </motion.button>
          </form>
          <p className="mt-6 text-center">
            <Link to="/" className="text-cyan-400 hover:text-cyan-300 text-sm inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'newsletter', label: 'Subscribed', icon: <Mail className="w-4 h-4" />, count: newsletter.length },
    { id: 'unsubscribed', label: 'Unsubscribed', icon: <UserMinus className="w-4 h-4" />, count: unsubscribed.length },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-4 h-4" />, count: bookings.length },
    { id: 'contact', label: 'Contact', icon: <MessageSquare className="w-4 h-4" />, count: contact.length },
  ];
  const unsubscribedSet = new Set(unsubscribed.map((u) => u.email.toLowerCase()));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0a0f1a] to-[#030712]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[rgba(8,12,24,0.92)] backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </Link>
            <img src="/logo.svg" alt="SyllaTech" className="h-7" />
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHasNewNotifications(false);
                if (storedKey) {
                  fetchData(storedKey);
                  if (adminSection === 'analytics') fetchAnalytics();
                  if (adminSection === 'slots') fetchSlotsConfig();
                }
              }}
              disabled={loading}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
            </button>
            <div className="relative" ref={notificationsPanelRef}>
              <button
                onClick={() => {
                  setHasNewNotifications(false);
                  setShowNotificationsPanel((p) => !p);
                }}
                className={cn(
                  "relative p-2 rounded-xl transition-colors",
                  showNotificationsPanel ? "text-cyan-400 bg-white/[0.05]" : "text-slate-400 hover:text-cyan-400 hover:bg-white/[0.05]"
                )}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {hasNewNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                )}
              </button>
              <AnimatePresence>
                {showNotificationsPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0f1a] shadow-xl z-50 flex flex-col"
                  >
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-400" />
                        Recent activity
                      </span>
                      <button
                        onClick={() => {
                          setAdminSection('submissions');
                          setShowNotificationsPanel(false);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300"
                      >
                        View all
                      </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {recentNotifications.length === 0 ? (
                        <p className="p-4 text-slate-500 text-sm">No recent submissions.</p>
                      ) : (
                        <ul className="divide-y divide-white/[0.04]">
                          {recentNotifications.map((n) => (
                            <li
                              key={`${n.type}-${n.id}`}
                              className="px-4 py-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
                              onClick={() => {
                                setAdminSection('submissions');
                                setActiveTab(n.type === 'newsletter' ? 'newsletter' : n.type === 'booking' ? 'bookings' : 'contact');
                                setShowNotificationsPanel(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                  n.type === 'newsletter' && "bg-violet-500/20 text-violet-400",
                                  n.type === 'booking' && "bg-cyan-500/20 text-cyan-400",
                                  n.type === 'contact' && "bg-amber-500/20 text-amber-400"
                                )}>
                                  {n.type === 'newsletter' && <Mail className="w-4 h-4" />}
                                  {n.type === 'booking' && <Calendar className="w-4 h-4" />}
                                  {n.type === 'contact' && <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-white">{n.label}</p>
                                  <p className="text-xs text-slate-400 truncate">{n.detail}</p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {new Date(n.ts).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setAdminSection('settings')}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
              title="Change password"
            >
              <KeyRound className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Section + Tabs */}
        <div className="max-w-[1280px] mx-auto px-6 border-t border-white/[0.06]">
          <div className="flex gap-1 pt-2 flex-wrap">
            <button
              onClick={() => setAdminSection('analytics')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors",
                adminSection === 'analytics'
                  ? "bg-white/[0.05] text-cyan-400 border-b-2 border-cyan-500 -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setAdminSection('submissions')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors",
                adminSection === 'submissions'
                  ? "bg-white/[0.05] text-cyan-400 border-b-2 border-cyan-500 -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <FileText className="w-4 h-4" />
              Submissions
            </button>
            <button
              onClick={() => setAdminSection('email')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors",
                adminSection === 'email'
                  ? "bg-white/[0.05] text-cyan-400 border-b-2 border-cyan-500 -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Send className="w-4 h-4" />
              Email Campaigns
            </button>
            <button
              onClick={() => setAdminSection('slots')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors",
                adminSection === 'slots'
                  ? "bg-white/[0.05] text-cyan-400 border-b-2 border-cyan-500 -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <Settings className="w-4 h-4" />
              Booking Slots
            </button>
            <button
              onClick={() => setAdminSection('settings')}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors",
                adminSection === 'settings'
                  ? "bg-white/[0.05] text-cyan-400 border-b-2 border-cyan-500 -mb-px"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              <KeyRound className="w-4 h-4" />
              Settings
            </button>
          </div>
          {adminSection === 'submissions' && (
            <div className="flex gap-1">
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
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        {adminSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Analytics
              </span>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Website Analytics
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 transition-colors p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Total Visits</p>
                    <p className="text-2xl font-bold text-white">{analytics?.total_visits ?? '—'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 transition-colors p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Today</p>
                    <p className="text-2xl font-bold text-white">{analytics?.visits_today ?? '—'}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 transition-colors p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20">
                    <Globe className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Countries</p>
                    <p className="text-2xl font-bold text-white">{analytics?.by_country?.length ?? 0}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 transition-colors p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/20">
                    <Mail className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Subscribers</p>
                    <p className="text-2xl font-bold text-white">{newsletter.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-medium text-white">Visits by Country</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {analytics?.by_country?.length ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Country</th>
                          <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase">Visits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.by_country.map((row) => (
                          <tr key={row.country} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2.5 text-slate-300">{row.country}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-cyan-400">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-slate-500 text-sm">No visit data yet. Analytics will appear as visitors browse your site.</p>
                  )}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-medium text-white">Visits by Region</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {analytics?.by_region?.length ? (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Country / Region</th>
                          <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase">Visits</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.by_region.map((row, i) => (
                          <tr key={`${row.country}-${row.region}-${i}`} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                            <td className="px-4 py-2.5 text-slate-300">{row.region ? `${row.region}, ${row.country}` : row.country}</td>
                            <td className="px-4 py-2.5 text-right font-medium text-cyan-400">{row.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="p-4 text-slate-500 text-sm">No region data yet.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="font-medium text-white">Recent Visits</h3>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {analytics?.recent?.length ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Path</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Location</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.recent.map((row, i) => (
                        <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                          <td className="px-4 py-2 text-slate-300 font-mono text-sm">{row.path || '/'}</td>
                          <td className="px-4 py-2 text-slate-400 text-sm">{[row.city, row.region, row.country].filter(Boolean).join(', ') || '—'}</td>
                          <td className="px-4 py-2 text-slate-500 text-sm">
                            {row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-4 text-slate-500 text-sm">No recent visits.</p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {adminSection === 'email' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-cyan-400" />
              Send HTML Email
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  <Users className="w-4 h-4 inline mr-1" /> Send to
                </label>
                <select
                  value={emailForm.audience}
                  onChange={(e) => setEmailForm((f) => ({ ...f, audience: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="">Select audience...</option>
                  {audiences.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label} ({a.count})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email type</label>
                <select
                  value={emailForm.emailType}
                  onChange={(e) => setEmailForm((f) => ({ ...f, emailType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="news">News</option>
                  <option value="offer">Offer</option>
                  <option value="announcement">Announcement</option>
                  <option value="update">Update</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
              <input
                type="text"
                value={emailForm.subject}
                onChange={(e) => setEmailForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="e.g. Spring Sale — 20% Off"
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            {emailForm.audience && recipients.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-400">
                    Recipients ({selectedEmails.size} of {recipients.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedEmails(new Set(recipients.map((r) => r.email)))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                    >
                      Select all
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedEmails(new Set())}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                    >
                      Deselect all
                    </button>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-600 overflow-hidden bg-slate-800/50 max-h-48 overflow-y-auto">
                  <div className="p-2 space-y-1">
                    {recipients.map((r) => (
                      <label
                        key={r.email}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-700/50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEmails.has(r.email)}
                          onChange={(e) => {
                            setSelectedEmails((prev) => {
                              const next = new Set(prev);
                              if (e.target.checked) next.add(r.email);
                              else next.delete(r.email);
                              return next;
                            });
                          }}
                          className="rounded border-slate-500 bg-slate-700 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-slate-300 truncate">
                          {r.name ? `${r.name} <${r.email}>` : r.email}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-400">HTML body</label>
                <button
                  type="button"
                  onClick={() => setEmailForm((f) => ({ ...f, htmlBody: f.htmlBody ? f.htmlBody : HTML_EMAIL_TEMPLATE }))}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white transition-colors"
                >
                  {emailForm.htmlBody ? 'Reset template' : 'Load template'}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="admin-html-editor rounded-xl border border-slate-600 overflow-hidden bg-slate-900">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-slate-800/80">
                    <span className="text-xs font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-700/50">html</span>
                  </div>
                  <CodeEditor
                    value={emailForm.htmlBody}
                    language="html"
                    placeholder="Paste your HTML or click 'Load template' for a starter"
                    onChange={(e) => setEmailForm((f) => ({ ...f, htmlBody: e.target.value }))}
                    padding={16}
                    data-color-mode="dark"
                    style={{
                      fontSize: 13,
                      minHeight: 320,
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                    }}
                    className="w-full rounded-b-xl border-0"
                  />
                </div>
                <div className="rounded-xl border border-slate-600 overflow-hidden bg-slate-900 flex flex-col">
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-slate-800/80 shrink-0">
                    <span className="text-xs font-medium text-slate-500 px-2 py-0.5 rounded bg-slate-700/50">Preview</span>
                  </div>
                  <div className="flex-1 min-h-[400px] overflow-auto bg-[#030712]">
                    <iframe
                      title="HTML preview"
                      srcDoc={getPreviewHtml(emailForm.htmlBody)}
                      className="w-full border-0 bg-[#030712] block"
                      sandbox="allow-same-origin"
                      style={{ minHeight: 560 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSendEmail}
                disabled={sendingEmail || !emailForm.audience || !emailForm.subject.trim() || !emailForm.htmlBody.trim() || selectedEmails.size === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {sendingEmail ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send to {selectedEmails.size} recipient(s)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {adminSection === 'slots' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Booking Slots Configuration
            </h2>
            <p className="text-slate-400 text-sm">Configure available times for consultations. Visitors see these when booking.</p>

            {slotsConfig && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Time slots</label>
                  <p className="text-xs text-slate-500 mb-2">One per line, e.g. 09:00 AM</p>
                  <textarea
                    value={slotsConfig.time_slots.join('\n')}
                    onChange={(e) => setSlotsConfig((s) => s ? { ...s, time_slots: e.target.value.split('\n').map((t) => t.trim()).filter(Boolean) } : s)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder={'09:00 AM\n09:30 AM\n10:00 AM'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Blocked dates (YYYY-MM-DD)</label>
                  <p className="text-xs text-slate-500 mb-2">One per line, e.g. 2025-12-25</p>
                  <textarea
                    value={slotsConfig.blocked_dates.join('\n')}
                    onChange={(e) => setSlotsConfig((s) => s ? { ...s, blocked_dates: e.target.value.split('\n').map((t) => t.trim()).filter(Boolean) } : s)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none"
                    placeholder={'2025-12-25\n2026-01-01'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Available weekdays</label>
                  <p className="text-xs text-slate-500 mb-2">0=Sun, 1=Mon, ..., 6=Sat. Check the days you accept bookings.</p>
                  <div className="flex flex-wrap gap-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slotsConfig.available_weekdays.includes(i)}
                          onChange={(e) => {
                            setSlotsConfig((s) => {
                              if (!s) return s;
                              const next = e.target.checked ? [...s.available_weekdays, i].sort() : s.available_weekdays.filter((d) => d !== i);
                              return { ...s, available_weekdays: next };
                            });
                          }}
                          className="rounded border-slate-500 bg-slate-700 text-cyan-500"
                        />
                        <span className="text-slate-300 text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <motion.button
                    onClick={saveSlotsConfig}
                    disabled={slotsSaving}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold disabled:opacity-50 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {slotsSaving ? 'Saving...' : 'Save'}
                  </motion.button>
                </div>
              </>
            )}
          </div>
        )}

        {adminSection === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                Settings
              </span>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Change Admin Password
              </h2>
            </div>
            <p className="text-slate-400 text-sm">Update your admin secret key. You will need to use the new key to log in next time.</p>
            <div className="max-w-md space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Current password</label>
                <input
                  type="password"
                  value={passwordForm.current}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, current: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Enter current key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">New password</label>
                <input
                  type="password"
                  value={passwordForm.new}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, new: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Enter new key (min 4 chars)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm new password</label>
                <input
                  type="password"
                  value={passwordForm.confirm}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirm: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Confirm new key"
                />
              </div>
              <motion.button
                onClick={handleChangePassword}
                disabled={passwordSaving || !passwordForm.current || !passwordForm.new || !passwordForm.confirm}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold disabled:opacity-50 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {passwordSaving ? 'Updating...' : 'Update password'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {adminSection === 'submissions' && activeTab === 'newsletter' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-800/30">
              <span className="text-sm text-slate-400">Subscribed ({newsletter.length})</span>
              <button onClick={() => handleExport('newsletter')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newsletter.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                        No newsletter signups yet
                      </td>
                    </tr>
                  ) : (
                    newsletter.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">{item.email}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            unsubscribedSet.has(item.email.toLowerCase())
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          )}>
                            {unsubscribedSet.has(item.email.toLowerCase()) ? "Unsubscribed" : "Subscribed"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(item.timestamp)}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleReplyOpen(item.email, undefined, 'newsletter')}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditOpen(item)}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'newsletter', id: item.id, label: item.email })}
                              className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminSection === 'submissions' && activeTab === 'unsubscribed' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/30 text-sm text-slate-400">Unsubscribed ({unsubscribed.length})</div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Unsubscribed</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {unsubscribed.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-12 text-center text-slate-500">
                        No unsubscribes yet
                      </td>
                    </tr>
                  ) : (
                    unsubscribed.map((item) => (
                      <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="px-4 py-3 text-white">{item.email}</td>
                        <td className="px-4 py-3 text-slate-500 text-sm">{formatDate(item.timestamp)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setDeleteTarget({ type: 'unsubscribed', id: item.email, label: item.email })}
                            className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="Re-subscribe (remove from list)"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <p className="px-4 py-2 text-xs text-slate-500 border-t border-slate-800">Remove = re-subscribe (they can receive campaigns again)</p>
          </div>
        )}

        {adminSection === 'submissions' && activeTab === 'bookings' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-800/30">
              <span className="text-sm text-slate-400">Bookings ({bookings.length})</span>
              <button onClick={() => handleExport('bookings')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date & Time</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Business</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleReplyOpen(item.email, item.name, 'booking')}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditOpen(item)}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'bookings', id: item.id, label: `${item.name} (${item.email})` })}
                              className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminSection === 'submissions' && activeTab === 'contact' && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-800/30">
              <span className="text-sm text-slate-400">Contact ({contact.length})</span>
              <button onClick={() => handleExport('contact')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Name</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Business</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Message</th>
                    <th className="text-left px-4 py-3 text-slate-400 font-medium">Date</th>
                    <th className="text-right px-4 py-3 text-slate-400 font-medium w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contact.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleReplyOpen(item.email, item.name, 'contact')}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Reply"
                            >
                              <Reply className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditOpen(item)}
                              className="p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'contact', id: item.id, label: `${item.name} (${item.email})` })}
                              className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Reply modal */}
      {replyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto" onClick={() => setReplyTarget(null)}>
          <div className="w-full max-w-lg rounded-xl border border-white/[0.06] bg-[#0a0f1a] p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Reply className="w-5 h-5 text-cyan-400" />
              Reply to {replyTarget.name || replyTarget.email}
            </h3>
            <p className="text-slate-500 text-sm mb-4">To: {replyTarget.email}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:border-cyan-500/50 focus:outline-none"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Message (HTML or plain text)</label>
                <textarea
                  value={replyForm.htmlBody}
                  onChange={(e) => setReplyForm((f) => ({ ...f, htmlBody: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white font-mono text-sm focus:border-cyan-500/50 focus:outline-none resize-y"
                  placeholder="Type your message..."
                />
                <p className="text-xs text-slate-500 mt-1">Simple HTML works (e.g. &lt;p&gt;Hello!&lt;/p&gt;). Plain text is also fine.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setReplyTarget(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={replySending || !replyForm.subject.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium disabled:opacity-50"
              >
                {replySending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setDeleteTarget(null)}>
          <div className="w-full max-w-md rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-2">
              {deleteTarget.type === 'unsubscribed' ? 'Re-subscribe?' : 'Delete submission?'}
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              {deleteTarget.type === 'unsubscribed'
                ? `${deleteTarget.label} — Remove from unsubscribed list. They can receive campaigns again.`
                : `${deleteTarget.label} — This cannot be undone.`}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={actionLoading}
                className={cn(
                  "px-4 py-2 rounded-lg text-white disabled:opacity-50",
                  deleteTarget.type === 'unsubscribed'
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                    : "bg-red-600 hover:bg-red-700"
                )}
              >
                {actionLoading ? '...' : deleteTarget.type === 'unsubscribed' ? 'Re-subscribe' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto" onClick={() => setEditTarget(null)}>
          <div className="w-full max-w-lg rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white mb-4">Edit {activeTab === 'newsletter' ? 'Subscriber' : activeTab === 'bookings' ? 'Booking' : 'Contact'}</h3>
          <div className="space-y-4 py-4">
            {activeTab === 'newsletter' && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email || ''}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
            {activeTab === 'bookings' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={editForm.date || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                    placeholder="e.g. Wednesday, February 5, 2025"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Date (ISO)</label>
                  <input
                    type="text"
                    value={editForm.date_iso || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, date_iso: e.target.value }))}
                    placeholder="YYYY-MM-DD"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={editForm.time || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Business</label>
                  <input
                    type="text"
                    value={editForm.business || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, business: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                  <textarea
                    value={editForm.message || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </>
            )}
            {activeTab === 'contact' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Business</label>
                  <input
                    type="text"
                    value={editForm.business || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, business: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Message</label>
                  <textarea
                    value={editForm.message || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-700">
            <button
              onClick={() => setEditTarget(null)}
              className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSave}
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Admin;
