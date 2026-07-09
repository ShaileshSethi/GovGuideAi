"use client";

import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

const FAQS = [
  {
    q: 'What is a Domicile Certificate?',
    a: 'A Domicile Certificate is an official document that proves a person is a resident of a particular state or union territory. It is often required for educational quotas and government jobs.'
  },
  {
    q: 'Is Aadhaar mandatory for all services?',
    a: 'While highly recommended and widely used for eKYC, Aadhaar is not legally mandatory for all services, though it significantly speeds up processing times for most government applications.'
  },
  {
    q: 'How long does a Passport renewal take?',
    a: 'Under the normal scheme, it usually takes 30-45 days. Under the Tatkaal scheme, it can be issued within 1-3 days.'
  },
  {
    q: 'What is the difference between a PAN card and an Aadhaar card?',
    a: 'A PAN (Permanent Account Number) is primarily for tax purposes and financial transactions, issued by the Income Tax Department. Aadhaar is a biometric identity card issued by UIDAI, used as a universal proof of identity and address.'
  }
];

const GLOSSARY = [
  { term: 'eKYC', definition: 'Electronic Know Your Customer. A digital process used by the government and banks to verify your identity using Aadhaar biometrics or OTP.' },
  { term: 'Tatkaal', definition: 'An expedited processing scheme for urgent services (like passports or train tickets), usually requiring an additional fee.' },
  { term: 'Gazetted Officer', definition: 'A high-ranking government official whose signature and stamp are often required to attest copies of important documents.' },
  { term: 'Notary Public', definition: 'A person authorized by the government to perform legal formalities, especially certifying contracts and deeds or attesting documents.' },
  { term: 'Affidavit', definition: 'A written statement confirmed by oath or affirmation, for use as evidence in court or for government applications.' }
];

export default function KnowledgeBase() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'faq' | 'glossary'>('faq');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground drop-shadow-sm">
          Knowledge Base
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          Understand government terminology and find answers to common questions.
        </p>
      </motion.div>

      <div className="flex justify-center mb-8 space-x-4">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'faq' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-foreground hover:bg-muted border border-border'}`}
        >
          Frequently Asked Questions
        </button>
        <button
          onClick={() => setActiveTab('glossary')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'glossary' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-foreground hover:bg-muted border border-border'}`}
        >
          Glossary of Terms
        </button>
      </div>

      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 transition-colors">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-lg text-foreground focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <svg className={`w-5 h-5 text-primary transform transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {expandedFaq === idx && (
                  <div className="px-6 pb-5 text-muted-foreground font-medium leading-relaxed border-t border-border/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'glossary' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GLOSSARY.map((item, idx) => (
              <div key={idx} className="bg-card/80 backdrop-blur-sm border border-border p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
                <h3 className="text-xl font-bold text-primary mb-2">{item.term}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{item.definition}</p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
