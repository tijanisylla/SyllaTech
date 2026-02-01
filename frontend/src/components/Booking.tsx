import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Calendar, Clock, Video, CheckCircle, ChevronLeft, ChevronRight, User, Mail, Phone, Building2, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';

const Booking: React.FC = () => {
  const { isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates and weekends
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

  // Available time slots
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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Booking Confirmed!', { 
      description: `Your consultation is scheduled for ${selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${selectedTime}` 
    });
    setIsSubmitting(false);
    // Reset form
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setFormData({ name: '', email: '', phone: '', business: '', message: '' });
  };

  const canProceedToStep2 = selectedDate && selectedTime;
  const canProceedToStep3 = formData.name && formData.email;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentMonth);

  const benefits = [
    { icon: <Video className="w-5 h-5" />, text: "30-min video call" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "No obligation" },
    { icon: <Clock className="w-5 h-5" />, text: "Custom quote in 24h" },
    { icon: <User className="w-5 h-5" />, text: "Direct founder access" },
  ];

  return (
    <section id="booking" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-[#030712]' : 'bg-slate-50'}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] ${
        isDark ? 'bg-blue-600/5' : 'bg-blue-600/10'
      }`} />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 max-w-[1100px] mx-auto px-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${
            isDark 
              ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' 
              : 'bg-blue-50 border border-blue-200 text-blue-600'
          }`}>
            Free Consultation
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Book Your{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
              Discovery Call
            </span>
          </h2>
          <p className={`text-lg max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Schedule a free 30-minute consultation to discuss your project goals
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                      : isDark 
                        ? 'bg-white/5 text-slate-500 border border-white/10' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-16 h-1 rounded-full ${
                    step > s 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                      : isDark ? 'bg-white/10' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Booking Card */}
        <motion.div
          variants={itemVariants}
          className={`rounded-3xl border overflow-hidden ${
            isDark 
              ? 'bg-gradient-to-br from-white/[0.03] to-white/[0.01] border-white/[0.08]' 
              : 'bg-white border-slate-200 shadow-xl'
          }`}
        >
          <div className="grid lg:grid-cols-5">
            {/* Left Sidebar - Benefits */}
            <div className={`lg:col-span-2 p-8 ${
              isDark 
                ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-r border-white/5' 
                : 'bg-gradient-to-br from-cyan-50 to-blue-50 border-r border-slate-100'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Discovery Call</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>30 minutes</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                      {benefit.icon}
                    </div>
                    <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selected Info */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl ${
                    isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    Selected Date & Time
                  </p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  {selectedTime && (
                    <p className={`${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{selectedTime}</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Right Content - Steps */}
            <div className="lg:col-span-3 p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Date & Time Selection */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Select Date & Time
                    </h4>

                    {/* Calendar */}
                    <div className={`rounded-2xl p-4 mb-6 ${
                      isDark ? 'bg-white/[0.02] border border-white/[0.06]' : 'bg-slate-50 border border-slate-200'
                    }`}>
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => navigateMonth('prev')}
                          className={`p-2 rounded-lg transition-all ${
                            isDark 
                              ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                              : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {formatMonth(currentMonth)}
                        </span>
                        <button
                          onClick={() => navigateMonth('next')}
                          className={`p-2 rounded-lg transition-all ${
                            isDark 
                              ? 'hover:bg-white/10 text-slate-400 hover:text-white' 
                              : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Week Days */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {weekDays.map(day => (
                          <div key={day} className={`text-center text-xs font-medium py-2 ${
                            isDark ? 'text-slate-500' : 'text-slate-500'
                          }`}>
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {days.map((day, idx) => (
                          <div key={idx} className="aspect-square">
                            {day && (
                              <button
                                onClick={() => selectDate(day)}
                                disabled={isDateDisabled(day)}
                                className={`w-full h-full rounded-lg text-sm font-medium transition-all ${
                                  selectedDate?.getDate() === day && 
                                  selectedDate?.getMonth() === currentMonth.getMonth()
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                    : isDateDisabled(day)
                                      ? isDark 
                                        ? 'text-slate-700 cursor-not-allowed' 
                                        : 'text-slate-300 cursor-not-allowed'
                                      : isDark
                                        ? 'text-slate-300 hover:bg-white/10'
                                        : 'text-slate-700 hover:bg-slate-200'
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
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <p className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Available Times
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {timeSlots.map(time => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
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

                    {/* Continue Button */}
                    <motion.button
                      onClick={() => setStep(2)}
                      disabled={!canProceedToStep2}
                      className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                        canProceedToStep2
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                          : isDark
                            ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      whileHover={canProceedToStep2 ? { scale: 1.02 } : {}}
                      whileTap={canProceedToStep2 ? { scale: 0.98 } : {}}
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Contact Info */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setStep(1)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 text-slate-400' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Your Information
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <User className="w-4 h-4" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                            isDark 
                              ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                          }`}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Mail className="w-4 h-4" />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                          className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                            isDark 
                              ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                          }`}
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 000-0000"
                          className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${
                            isDark 
                              ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                              : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                          }`}
                        />
                      </div>

                      {/* Business Type */}
                      <div>
                        <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          <Building2 className="w-4 h-4" />
                          Business Type
                        </label>
                        <select
                          name="business"
                          value={formData.business}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all ${
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

                    {/* Continue Button */}
                    <motion.button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className={`w-full mt-8 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                        canProceedToStep3
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                          : isDark
                            ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      whileHover={canProceedToStep3 ? { scale: 1.02 } : {}}
                      whileTap={canProceedToStep3 ? { scale: 0.98 } : {}}
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 3: Additional Info & Confirm */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <button
                        onClick={() => setStep(2)}
                        className={`p-2 rounded-lg transition-all ${
                          isDark 
                            ? 'hover:bg-white/10 text-slate-400' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Almost Done!
                      </h4>
                    </div>

                    {/* Summary */}
                    <div className={`p-4 rounded-xl mb-6 ${
                      isDark ? 'bg-white/[0.03] border border-white/[0.08]' : 'bg-slate-50 border border-slate-200'
                    }`}>
                      <h5 className={`text-sm font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Booking Summary
                      </h5>
                      <div className="space-y-2">
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

                    {/* Message */}
                    <div className="mb-6">
                      <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        <MessageSquare className="w-4 h-4" />
                        Anything you'd like to discuss? (Optional)
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Tell us about your project..."
                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none transition-all resize-none ${
                          isDark 
                            ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500 focus:border-cyan-500/50' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-cyan-500'
                        }`}
                      />
                    </div>

                    {/* Confirm Button */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-70"
                      whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                      whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          Confirm Booking
                        </>
                      )}
                    </motion.button>

                    <p className={`text-center text-xs mt-4 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      You'll receive a confirmation email with a calendar invite
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Booking;
