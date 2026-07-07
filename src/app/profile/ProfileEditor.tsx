"use client";

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfileEditor({ initialUser }: { initialUser: any }) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [viewingPlan, setViewingPlan] = useState<any | null>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem('govguide_history');
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    }
  }, []);
  
  // Local state to simulate updates without a backend
  const [user, setUser] = useState({
    name: initialUser?.name || 'User',
    email: initialUser?.email || 'user@example.com',
    image: initialUser?.image || null
  });

  // Draft state for edits
  const [draft, setDraft] = useState({
    name: user.name,
    email: user.email
  });

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUser({ ...user, name: draft.name, email: draft.email });
    setIsEditing(false);
    setIsLoading(false);
    toast.success('Profile updated successfully!');
  };

  const handleCancel = () => {
    setDraft({ name: user.name, email: user.email });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-[#111827]">
          {t('profile.title')}
        </h1>
        <p className="text-lg text-gray-500 font-medium">
          {t('profile.subtitle')}
        </p>
      </div>
      <div className="space-y-8">
      {/* Profile Card */}
      <section className="bg-card border border-[#E5E7EB] rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-8 transition-all">
        
        {/* Avatar */}
        <div className="flex-shrink-0 relative">
          {user.image ? (
            <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full border border-gray-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-accent border border-border flex items-center justify-center text-4xl text-primary font-bold shadow-inner">
              {user.name[0]?.toUpperCase() || 'U'}
            </div>
          )}
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-card border border-[#E5E7EB] rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary shadow-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
          )}
        </div>
        
        {/* User Details */}
        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('profile.name')}</label>
                <input 
                  type="text" 
                  value={draft.name}
                  onChange={(e) => setDraft({...draft, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none font-bold text-[#111827] shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{t('profile.email')}</label>
                <input 
                  type="email" 
                  value={draft.email}
                  onChange={(e) => setDraft({...draft, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-muted-foreground shadow-sm"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-2xl font-bold text-[#111827]">{user.name}</h2>
                <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-primary transition-colors p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
              </div>
              <p className="text-muted-foreground font-medium mb-4">{user.email}</p>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-sm font-bold text-foreground">
                <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                {t('profile.free')}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div>
          {isEditing ? (
            <div className="flex flex-col space-y-2 md:w-40">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-[#166534] disabled:opacity-70 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-sm flex justify-center items-center h-12"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  t('profile.save')
                )}
              </button>
              <button 
                onClick={handleCancel}
                disabled={isLoading}
                className="w-full bg-card border border-[#E5E7EB] text-foreground hover:bg-muted px-6 py-3 rounded-xl font-bold transition-all shadow-sm h-12"
              >
                {t('profile.cancel')}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => toast.success('Premium upgrades are coming soon!')}
              className="w-full md:w-auto bg-[#111827] hover:bg-black text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm"
            >
              {t('profile.upgrade')}
            </button>
          )}
        </div>
      </section>

      {/* History / Saved Plans */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold text-[#111827]">{t('profile.recent')}</h3>
          <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-gray-200">
            {history.length} {t('profile.saved')}
          </span>
        </div>
        
        {history.length === 0 ? (
          <div className="bg-card border border-[#E5E7EB] rounded-3xl p-10 text-center shadow-sm">
            <span className="text-4xl mb-4 block">📄</span>
            <h4 className="text-lg font-bold text-[#111827] mb-2">{t('profile.no_plans')}</h4>
            <p className="text-muted-foreground">{t('profile.no_plans_desc')}</p>
          </div>
        ) : (
          <div className="bg-card border border-[#E5E7EB] rounded-3xl shadow-sm overflow-hidden">
            {history.map((item, idx) => (
              <div key={item.id} className={`p-6 flex items-center justify-between hover:bg-[#FAFAF8] transition-colors cursor-pointer group ${idx !== history.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mr-4 shadow-sm border border-border">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#111827] group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground font-medium mt-0.5">{t('profile.generated_on')} {item.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setViewingPlan(item)}
                    className="hidden md:block text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t('profile.view_plan')}
                  </button>
                  <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* View Plan Modal */}
      {viewingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setViewingPlan(null)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground bg-muted hover:bg-gray-200 p-2 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="flex items-center mb-6 border-b border-[#E5E7EB] pb-4">
              <span className="text-4xl mr-4">{viewingPlan.icon}</span>
              <div>
                <h3 className="text-2xl font-bold text-[#111827]">{viewingPlan.title}</h3>
                <p className="text-sm text-muted-foreground">{t('profile.saved')} {viewingPlan.date}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-accent border border-border p-5 rounded-2xl">
                <p className="text-sm text-[#1E3A8A] font-bold">{viewingPlan.data.summary}</p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#111827] mb-3">{t('plan.services')}</h4>
                <div className="space-y-3">
                  {viewingPlan.data.services?.map((s: any, i: number) => (
                    <div key={i} className="border border-[#E5E7EB] rounded-xl p-4 bg-muted/30">
                      <h5 className="font-bold text-[#111827]">{s.name}</h5>
                      <p className="text-sm text-muted-foreground">{s.description}</p>
                      <div className="mt-2 text-xs font-bold text-gray-500 flex gap-4">
                        <span>🕒 {s.processing_time}</span>
                        <span>💵 {s.application_fee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {viewingPlan.data.next_steps && (
                <div>
                  <h4 className="text-lg font-bold text-[#111827] mb-3">{t('plan.next')}</h4>
                  <ul className="space-y-2">
                    {viewingPlan.data.next_steps.map((step: string, i: number) => (
                      <li key={i} className="text-sm text-foreground flex items-start">
                        <span className="text-primary font-bold mr-2">{i+1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
