import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Video, CheckCircle, ChevronLeft, ChevronRight, User, Mail, Phone, Building2, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  
  // Booking state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal closes
  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', email: '', phone: '', business: '', message: '' });
    onClose();
  };

  // Generate calendar days
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const selectDate = (day: number) => {
    if (!isDateDisabled(day)) {
      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
      setSelectedTime(null);
    }
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Booking Confirmed!', { 
      description: `Your consultation is scheduled for ${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedTime}` 
    });
    setIsSubmitting(false);
    handleClose();
  };

  const canProceedToStep2 = selectedDate && selectedTime;
  const canProceedToStep3 = formData.name && formData.email;
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentMonth);

  const benefits = [
    { icon: <Video className="w-4 h-4" />, text: "30-min video call" },
    { icon: <CheckCircle className="w-4 h-4" />, text: "No obligation" },
    { icon: <Clock className="w-4 h-4" />, text: "Quote in 24h" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] z-50 overflow-hidden"
          >
            <div className={`h-full rounded-2xl border overflow-hidden flex flex-col ${
              isDark 
                ? 'bg-[#0a0f1a] border-white/10' 
                : 'bg-white border-slate-200 shadow-2xl'
            }`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-4">
                  <img
                    src={isDark ? "/logo.svg" : "/logo-light.svg"}
                    alt="SyllaTech"
                    className="h-7"
                  />
                  <div className={`h-6 w-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Book a Consultation
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className={`p-2 rounded-lg transition-all ${
                    isDark 
                      ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                      : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Steps */}
              <div className={`flex justify-center py-4 border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all ${
                          step >= s 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                            : isDark 
                              ? 'bg-white/5 text-slate-500 border border-white/10' 
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {step > s ? <Check className="w-4 h-4" /> : s}
                      </div>
                      {s < 3 && (
                        <div className={`w-12 h-0.5 rounded-full ${
                          step > s 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                            : isDark ? 'bg-white/10' : 'bg-slate-200'
                        }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-5 h-full">
                  {/* Left Sidebar */}
                  <div className={`md:col-span-2 p-6 ${
                    isDark 
                      ? 'bg-gradient-to-br from-cyan-500/5 to-blue-600/5 border-r border-white/5' 
                      : 'bg-gradient-to-br from-cyan-50/50 to-blue-50/50 border-r border-slate-100'
                  }`}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>Discovery Call</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>30 minutes</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                            {benefit.icon}
                          </div>
                          <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            {benefit.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-xl ${
                          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
                        }`}
                      >
                        <p className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          Selected
                        </p>
                        <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        {selectedTime && (
                          <p className={`text-sm ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{selectedTime}</p>
                        )}
                      </motion.div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className="md:col-span-3 p-6">
                    <AnimatePresence mode="wait">
                      {/* Step 1 */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h4 className={`text-base font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Select Date & Time
                          </h4>

                          {/* Calendar */}
                          <div className={`rounded-xl p-3 mb-4 ${
                            isDark ? 'bg-white/[0.02] border border-white/[0.06]' : 'bg-slate-50 border border-slate-200'
                          }`}>
                            <div className="flex items-center justify-between mb-3">
                              <button
                                onClick={() => navigateMonth('prev')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </button>
                              <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {formatMonth(currentMonth)}
                              </span>
                              <button
                                onClick={() => navigateMonth('next')}
                                className={`p-1.5 rounded-lg transition-all ${
                                  isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
                                }`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-1">
                              {weekDays.map(day => (
                                <div key={day} className={`text-center text-[10px] font-medium py-1 ${
                                  isDark ? 'text-slate-500' : 'text-slate-500'
                                }`}>
                                  {day}
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {days.map((day, idx) => (
                                <div key={idx} className="aspect-square">
                                  {day && (
                                    <button
                                      onClick={() => selectDate(day)}
                                      disabled={isDateDisabled(day)}
                                      className={`w-full h-full rounded-lg text-xs font-medium transition-all ${
                                        selectedDate?.getDate() === day && 
                                        selectedDate?.getMonth() === currentMonth.getMonth()
                                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                          : isDateDisabled(day)
                                            ? isDark ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 cursor-not-allowed'
                                            : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-200'
                                      }`}
                                    >
                                      {day}
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Time Slots */}
                          {selectedDate && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                              <p className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                Available Times
                              </p>
                              <div className="grid grid-cols-4 gap-1.5">
                                {timeSlots.map(time => (
                                  <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                                      selectedTime === time
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                        : isDark
                                          ? 'bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:border-cyan-500/50'
                                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-cyan-500'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          <motion.button
                            onClick={() => setStep(2)}
                            disabled={!canProceedToStep2}
                            className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                              canProceedToStep2
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                                : isDark ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            whileHover={canProceedToStep2 ? { scale: 1.02 } : {}}
                            whileTap={canProceedToStep2 ? { scale: 0.98 } : {}}
                          >
                            Continue <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 2 */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <button
                              onClick={() => setStep(1)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Your Information
                            </h4>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <User className="w-3.5 h-3.5" /> Full Name *
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="John Doe"
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                                  isDark 
                                    ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <Mail className="w-3.5 h-3.5" /> Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="john@example.com"
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                                  isDark 
                                    ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <Phone className="w-3.5 h-3.5" /> Phone
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 000-0000"
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                                  isDark 
                                    ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                                }`}
                              />
                            </div>

                            <div>
                              <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                <Building2 className="w-3.5 h-3.5" /> Business Type
                              </label>
                              <select
                                name="business"
                                value={formData.business}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                                  isDark 
                                    ? 'bg-white/[0.03] border-white/[0.08] text-white focus:border-cyan-500/50' 
                                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-cyan-500'
                                }`}
                              >
                                <option value="" className={isDark ? 'bg-slate-900' : 'bg-white'}>Select type</option>
                                <option value="auto" className={isDark ? 'bg-slate-900' : 'bg-white'}>Auto / Car Services</option>
                                <option value="restaurant" className={isDark ? 'bg-slate-900' : 'bg-white'}>Restaurant / Cafe</option>
                                <option value="retail" className={isDark ? 'bg-slate-900' : 'bg-white'}>Retail / E-commerce</option>
                                <option value="service" className={isDark ? 'bg-slate-900' : 'bg-white'}>Service Business</option>
                                <option value="startup" className={isDark ? 'bg-slate-900' : 'bg-white'}>Startup / Tech</option>
                                <option value="other" className={isDark ? 'bg-slate-900' : 'bg-white'}>Other</option>
                              </select>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => setStep(3)}
                            disabled={!canProceedToStep3}
                            className={`w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                              canProceedToStep3
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                                : isDark ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                            whileHover={canProceedToStep3 ? { scale: 1.02 } : {}}
                            whileTap={canProceedToStep3 ? { scale: 0.98 } : {}}
                          >
                            Continue <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </motion.div>
                      )}

                      {/* Step 3 */}
                      {step === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <button
                              onClick={() => setStep(2)}
                              className={`p-1.5 rounded-lg transition-all ${
                                isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                              }`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <h4 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Confirm Booking
                            </h4>
                          </div>

                          <div className={`p-3 rounded-xl mb-4 ${
                            isDark ? 'bg-white/[0.03] border border-white/[0.08]' : 'bg-slate-50 border border-slate-200'
                          }`}>
                            <h5 className={`text-xs font-medium mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              Summary
                            </h5>
                            <div className="space-y-1.5 text-sm">
                              <div className="flex justify-between">
                                <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Date</span>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Time</span>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedTime}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Name</span>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formData.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className={isDark ? 'text-slate-500' : 'text-slate-500'}>Email</span>
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{formData.email}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className={`flex items-center gap-1.5 text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                              <MessageSquare className="w-3.5 h-3.5" /> Additional Notes (Optional)
                            </label>
                            <textarea
                              name="message"
                              value={formData.message}
                              onChange={handleInputChange}
                              rows={2}
                              placeholder="Tell us about your project..."
                              className={`w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition-all resize-none ${
                                isDark 
                                  ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                              }`}
                            />
                          </div>

                          <motion.button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-70"
                            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Confirming...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Confirm Booking
                              </>
                            )}
                          </motion.button>

                          <p className={`text-center text-[10px] mt-3 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                            You'll receive a confirmation email with a calendar invite
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;
