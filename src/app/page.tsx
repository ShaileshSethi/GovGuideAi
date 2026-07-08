"use client";

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type Document = {
  name: string;
  mandatory: boolean;
  purpose: string;
  where_to_get: string;
  issuing_authority: string;
  official_link: string;
};

type Service = {
  name: string;
  description: string;
  required_documents: Document[];
  application_steps: string[];
  processing_time: string;
  application_fee: string;
  official_apply_link: string;
  official_information_link: string;
};

type ActionPlan = {
  isClarificationNeeded?: boolean;
  clarificationMessage?: string;
  summary: string;
  services: Service[];
  next_steps: string[];
  tips: string[];
};

const SUGGESTED_QUESTIONS = [
  { icon: "🛂", text: 'search.passport' },
  { icon: "🪪", text: 'search.pan' },
  { icon: "🚗", text: 'search.driving' },
  { icon: "🔐", text: 'search.aadhaar' }
];

const LOADING_MESSAGES = [
  "Analyzing your request...",
  "Finding government services...",
  "Collecting required documents...",
  "Preparing your action plan..."
];

export default function Home() {
  const { language, t } = useLanguage();
  const [category, setCategory] = useState('General Issue');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);
  const [result, setResult] = useState<ActionPlan | null>(null);
  const [error, setError] = useState('');

  // Track checked state: serviceIndex -> documentIndex -> boolean
  const [checkedDocs, setCheckedDocs] = useState<Record<number, Record<number, boolean>>>({});

  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (isListening) return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };
    recognition.onerror = (event: any) => {
      toast.error('Microphone error: ' + event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // UI State
  const [expandedServices, setExpandedServices] = useState<Record<number, boolean>>({});
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    } else {
      setLoadingMessageIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);
    setError('');
    setResult(null);
    setCheckedDocs({});
    setExpandedServices({ 0: true }); // Auto-expand the first service

    try {
      const combinedQuery = `Language Request: ${language === 'hi' ? 'Hindi' : 'English'}. Category: ${category}. Problem: ${searchQuery}`;

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: combinedQuery, language }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate action plan. Please try again.');
      }

      const data = await res.json();
      setResult(data);

      // Save to localStorage if not clarification
      if (!data.isClarificationNeeded && data.services) {
        const historyStr = localStorage.getItem('govguide_history');
        const history = historyStr ? JSON.parse(historyStr) : [];
        const newPlan = {
          id: Date.now().toString(),
          title: searchQuery.slice(0, 50) + (searchQuery.length > 50 ? '...' : ''),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          icon: SUGGESTED_QUESTIONS.find(q => q.text === searchQuery)?.icon || '📄',
          data: data
        };
        localStorage.setItem('govguide_history', JSON.stringify([newPlan, ...history].slice(0, 10)));
      }

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (serviceIdx: number, docIdx: number) => {
    setCheckedDocs(prev => ({
      ...prev,
      [serviceIdx]: {
        ...(prev[serviceIdx] || {}),
        [docIdx]: !prev[serviceIdx]?.[docIdx]
      }
    }));
  };

  const toggleServiceExpand = (index: number) => {
    setExpandedServices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <>
      {/* Document Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-card backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-border pb-4">{selectedDoc.name}</h3>

            <div className="space-y-5">
              <div>
                <span className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">Why it is needed</span>
                <p className="text-foreground font-medium">{selectedDoc.purpose}</p>
              </div>
              <div>
                <span className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">Where to obtain it</span>
                <p className="text-foreground font-medium">{selectedDoc.where_to_get}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">Issuing Authority</span>
                  <p className="text-foreground font-medium">{selectedDoc.issuing_authority}</p>
                </div>
                <div>
                  <span className="block text-xs font-bold text-primary uppercase tracking-wide mb-1">Mandatory</span>
                  <p className="text-foreground font-medium">{selectedDoc.mandatory ? "Yes" : "No"}</p>
                </div>
              </div>
              {selectedDoc.official_link && (
                <div className="pt-4 border-t border-border">
                  <a href={selectedDoc.official_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-accent border border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold py-3 rounded-xl transition-colors">
                    <span>Visit Official Source</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Empty State / Search Header */}
      <AnimatePresence mode="wait">
        {!result && !loading && (
          <motion.div 
            key="empty-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-12 relative"
          >
            {/* Ambient Hero Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] opacity-40 mix-blend-screen pointer-events-none blur-2xl">
              <Image src="/hero-graphic.png" alt="Hero background" fill className="object-cover" />
            </div>

            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20 backdrop-blur-md cursor-pointer"
            >
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground drop-shadow-sm">
              {t('home.title')}
            </h1>
            <h3 className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto drop-shadow-sm">
              {t('home.subtitle')}
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Section */}
      <motion.div 
        layout
        className={`transition-all duration-700 max-w-4xl mx-auto ${result ? 'mb-10' : 'mb-12 z-20 relative'}`}
      >
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
          className={`relative flex flex-col md:flex-row items-center bg-card/60 backdrop-blur-xl rounded-3xl md:rounded-full border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 focus-within:ring-4 focus-within:ring-primary/20 focus-within:border-primary/50 ${result ? 'shadow-md' : 'shadow-xl'}`}
        >
          <div className="flex w-full md:w-auto border-b md:border-b-0 md:border-r border-border">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-48 bg-transparent py-4 px-6 text-foreground font-bold focus:outline-none appearance-none cursor-pointer rounded-t-3xl md:rounded-l-full md:rounded-tr-none hover:bg-muted transition-colors"
              disabled={loading}
            >
              <option value="General Issue">{t('cat.general')}</option>
              <option value="Identity Documents">{t('cat.identity')}</option>
              <option value="Family & Marriage">{t('cat.family')}</option>
              <option value="Vehicles & Transport">{t('cat.vehicle')}</option>
              <option value="Property & Housing">{t('cat.property')}</option>
              <option value="Business & Taxes">{t('cat.business')}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground md:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="flex-1 w-full flex items-center relative">
            <div className="pl-6 pr-3 text-muted-foreground hidden lg:block">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.placeholder')}
              className="w-full bg-transparent py-4 md:py-5 pl-6 lg:pl-0 pr-12 text-lg text-foreground placeholder-muted-foreground focus:outline-none rounded-b-3xl md:rounded-r-full md:rounded-bl-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={startListening}
              className={`absolute right-1 p-2 rounded-full transition-all duration-300 ${isListening ? 'bg-red-100/50 backdrop-blur-sm text-red-600 animate-pulse scale-110' : 'text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
              title="Click to speak"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </button>
          </div>

          <div className="p-2 w-full md:w-auto relative z-10 ml-1">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 md:py-4 rounded-2xl md:rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:active:scale-100 whitespace-nowrap flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-primary/20 border border-primary/20"
            >
              {loading ? '...' : t('home.button')}
            </button>
          </div>
        </form>

      </motion.div>

      {/* Empty State / Loading State */}
      <AnimatePresence mode="wait">
        {!result && (
          <motion.div 
            key="loading-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-center flex flex-col items-center justify-center min-h-[20vh]"
          >
            {loading ? (
              <motion.div 
                key="loading-spinner"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(5px)' }}
                className="flex flex-col items-center"
              >
                <div className="relative w-16 h-16 mb-6">
                  <svg className="animate-spin text-border" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                </svg>
                <svg className="animate-spin absolute top-0 left-0 text-primary" viewBox="0 0 24 24" fill="none">
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                </div>
                <motion.p 
                  key={loadingMessageIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg text-muted-foreground font-bold"
                >
                  {LOADING_MESSAGES[loadingMessageIdx]}
                </motion.p>
              </motion.div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#FEF2F2] text-[#EF4444] border border-[#FECACA] p-5 rounded-2xl flex items-center max-w-lg mx-auto"
              >
              <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div className="text-left">
                <span className="font-bold block">We didn't quite understand that.</span>
                <span className="font-medium text-sm">{error} Can you provide more details?</span>
              </div>
                   </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular Categories & Quick Actions (Bottom of page when empty) */}
      <AnimatePresence>
        {!result && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 w-full max-w-4xl mx-auto px-4"
          >
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-foreground tracking-wide">Explore Services</h3>
                <div className="w-12 h-0.5 bg-primary/30 mx-auto mt-3 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: 'Passports & Travel', icon: '✈️', query: 'I need to apply for a new passport' },
                { title: 'Driving & Transport', icon: '🚗', query: 'How do I renew my driving license?' },
                { title: 'Housing & Property', icon: '🏠', query: 'What are the steps to buy a house?' },
                { title: 'Taxes & Business', icon: '💼', query: 'How to register a new business' },
                { title: 'Family & Marriage', icon: '💍', query: 'Process for registering a marriage' },
                { title: 'Identity Documents', icon: '🪪', query: 'Update address on identity card' },
              ].map((cat, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSearch(cat.query)}
                  className="flex items-center space-x-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 transition-colors shadow-sm text-left group"
                >
                  <span className="text-2xl bg-white/20 p-2 rounded-xl border border-white/30 group-hover:bg-white/40 transition-colors">{cat.icon}</span>
                  <span className="font-medium text-foreground tracking-tight">{cat.title}</span>
                </motion.button>
              ))}
              </div>
            </div>

            <div className="text-center pb-12">
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSearch(q.text)}
                    className="flex items-center space-x-2 bg-transparent backdrop-blur-sm border border-border/50 text-muted-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:border-primary/40 hover:text-foreground hover:bg-white/10 transition-colors"
                  >
                    <span>{q.icon}</span>
                    <span>{t(q.text)}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Clarification State */}
      <AnimatePresence>
        {result && result.isClarificationNeeded && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-8 bg-amber-50/50 backdrop-blur-md border border-amber-200/50 text-amber-700 p-8 rounded-3xl text-center max-w-2xl mx-auto shadow-sm"
          >
            <motion.div 
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, repeatDelay: 2 }}
              className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-200/50"
            >
              <span className="text-3xl">🤔</span>
            </motion.div>
            <h2 className="text-xl font-bold mb-2">We need a little more detail</h2>
            <p className="text-lg font-medium leading-relaxed">{result.clarificationMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Dashboard */}
      {result && !result.isClarificationNeeded && result.services && (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15, delayChildren: 0.2 }
            }
          }}
          className="space-y-10"
        >

          {/* 1. Summary Card */}
          <motion.section 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="bg-primary/5 backdrop-blur-md border border-primary/10 p-8 rounded-3xl shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground flex items-center">
                <span className="bg-card p-2 rounded-xl shadow-sm mr-3">🗺️</span>
                {t('plan.summary')}
              </h2>
            </div>
            <p className="text-lg text-foreground font-bold leading-relaxed">
              {result.summary}
            </p>
          </motion.section>

          {/* 2. Government Service Cards */}
          <section>
            <h3 className="text-xl font-bold text-foreground mb-5 border-b border-border pb-2">{t('plan.services')}</h3>
            <div className="space-y-6">
              {result.services.map((service, serviceIdx) => (
                <motion.div 
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ y: -4, scale: 1.005, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                  key={serviceIdx} 
                  className="bg-card/70 backdrop-blur-xl border border-white/40 rounded-3xl shadow-sm overflow-hidden transition-all duration-300"
                >
                  <div
                    className="p-6 md:p-8 cursor-pointer hover:bg-muted/50 flex items-center justify-between"
                    onClick={() => toggleServiceExpand(serviceIdx)}
                  >
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center text-2xl mr-5 shadow-sm border border-primary/20">🏛️</div>
                      <div>
                        <h4 className="text-2xl font-bold text-foreground mb-1">{service.name}</h4>
                        <p className="text-muted-foreground font-medium">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      <svg className={`w-6 h-6 transform transition-transform ${expandedServices[serviceIdx] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>

                  {expandedServices[serviceIdx] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-muted/30 backdrop-blur-md p-6 md:p-8 border-t border-border animate-in slide-in-from-top-4 duration-300"
                    >

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-card/80 p-4 rounded-2xl border border-white/20 shadow-sm">
                          <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('plan.time')}</span>
                          <span className="text-lg font-bold text-foreground">{service.processing_time}</span>
                        </div>
                        <div className="bg-card/80 p-4 rounded-2xl border border-white/20 shadow-sm">
                          <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('plan.fee')}</span>
                          <span className="text-lg font-bold text-foreground">{service.application_fee}</span>
                        </div>
                      </div>

                      {/* Document Checklist for this service */}
                      <h5 className="text-lg font-bold text-foreground mb-4">{t('plan.docs')}</h5>
                      <div className="space-y-3 mb-8">
                        {service.required_documents?.map((doc, docIdx) => (
                          <div
                            key={docIdx}
                            className={`bg-card/80 backdrop-blur-sm border p-4 rounded-2xl transition-all duration-200 flex items-center justify-between shadow-sm ${checkedDocs[serviceIdx]?.[docIdx] ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
                          >
                            <label className="flex items-center flex-grow cursor-pointer group">
                              <div className="flex-shrink-0 mr-4 relative">
                                <input
                                  type="checkbox"
                                  checked={!!checkedDocs[serviceIdx]?.[docIdx]}
                                  onChange={() => toggleCheck(serviceIdx, docIdx)}
                                  className={`w-6 h-6 rounded-md border-2 appearance-none cursor-pointer transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checkedDocs[serviceIdx]?.[docIdx] ? 'bg-primary border-primary' : 'bg-card border-muted-foreground/30 group-hover:border-primary/50'}`}
                                />
                                {checkedDocs[serviceIdx]?.[docIdx] && (
                                  <svg className="w-4 h-4 text-white absolute top-1 left-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                )}
                              </div>
                              <div>
                                <h4 className={`text-lg font-bold transition-colors ${checkedDocs[serviceIdx]?.[docIdx] ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                  {doc.name} {!doc.mandatory && <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-2">Optional</span>}
                                </h4>
                              </div>
                            </label>

                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="flex items-center text-primary font-bold text-sm bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2 rounded-xl transition-colors ml-4"
                            >
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Info
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Step-by-Step Guide for this service */}
                      <h5 className="text-lg font-bold text-foreground mb-4">{t('plan.steps')}</h5>
                      <div className="bg-card/80 backdrop-blur-sm border border-white/20 p-6 rounded-2xl shadow-sm mb-6">
                        <div className="relative border-l-2 border-primary/20 ml-4 space-y-6">
                          {service.application_steps?.map((step, idx) => (
                            <motion.div 
                              key={idx} 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 + 0.3 }}
                              className="relative pl-8 group"
                            >
                              <div className="absolute -left-[17px] top-0.5 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center shadow-sm group-hover:bg-primary transition-colors duration-300">
                                <span className="text-xs font-bold text-primary group-hover:text-primary-foreground">{idx + 1}</span>
                              </div>
                              <p className="text-foreground font-medium pt-1 leading-relaxed">{step}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Official Link */}
                      <div className="flex gap-4">
                        <a href={service.official_apply_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-3.5 rounded-xl transition-colors shadow-md border border-primary/20">
                          {t('plan.visit')}
                        </a>
                        {service.official_information_link && service.official_information_link !== service.official_apply_link && (
                          <a href={service.official_information_link} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-card border border-border text-foreground hover:bg-muted font-bold py-3.5 rounded-xl transition-colors shadow-sm">
                            {t('plan.more_info')}
                          </a>
                        )}
                      </div>

                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* 3. Global Tips & Next Steps */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {result.next_steps && result.next_steps.length > 0 && (
              <div className="bg-card/60 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-5 flex items-center">
                  <span className="bg-muted p-1.5 rounded-lg mr-2 border border-border">🚀</span> {t('plan.next')}
                </h3>
                <ul className="space-y-4">
                  {result.next_steps.map((step, idx) => (
                    <li key={idx} className="flex items-start text-foreground">
                      <span className="mr-3 mt-1 text-primary font-bold">{idx + 1}.</span>
                      <span className="leading-relaxed font-medium">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.tips && result.tips.length > 0 && (
              <div className="bg-amber-50/50 backdrop-blur-md border border-amber-200/50 p-8 rounded-3xl shadow-sm">
                <h3 className="text-lg font-bold text-amber-700 mb-5 flex items-center">
                  <span className="bg-card/50 p-1.5 rounded-lg mr-2 border border-amber-200/50">💡</span> {t('plan.tips')}
                </h3>
                <ul className="space-y-4">
                  {result.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-amber-800">
                      <span className="mr-3 mt-1 text-amber-500">•</span>
                      <span className="leading-relaxed font-medium">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.section>
        </motion.div>
      )}
    </>
  );
}
