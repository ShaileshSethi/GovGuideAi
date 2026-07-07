"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

type Translations = {
  [key: string]: string;
};

const translations: Record<Language, Translations> = {
  en: {
    "nav.home": "Home",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.signin": "Sign In",
    "nav.signout": "Sign out",
    "home.title": "GovGuide AI",
    "home.subtitle": "Describe your problem. We'll tell you exactly what to do.",
    "home.placeholder": "Specify your problem (e.g. I lost my Aadhaar card...)",
    "home.button": "Generate Action Plan",
    "home.suggestions": "Suggested Searches",
    "plan.summary": "Action Plan Summary",
    "plan.services": "Government Services Required",
    "plan.time": "Processing Time",
    "plan.fee": "Estimated Fees",
    "plan.docs": "Required Documents",
    "plan.steps": "Application Steps",
    "plan.visit": "Visit Official Website",
    "plan.more_info": "More Information",
    "plan.next": "Next Steps",
    "plan.tips": "Helpful Tips",
    "nav.feedback": "Feedback",
    "cat.general": "General Issue",
    "cat.identity": "Identity Documents",
    "cat.family": "Family & Marriage",
    "cat.vehicle": "Vehicles & Transport",
    "cat.property": "Property & Housing",
    "cat.business": "Business & Taxes",
    "search.passport": "Passport Renewal",
    "search.pan": "PAN Card",
    "search.driving": "Driving Licence",
    "search.aadhaar": "Aadhaar Update",
    "settings.title": "Settings",
    "settings.subtitle": "Manage your app preferences, security, and appearance.",
    "settings.security": "Security & Privacy",
    "settings.2fa": "Two-Factor Authentication (2FA)",
    "settings.2fa_desc": "Add an extra layer of security to your account.",
    "settings.sessions": "Active Sessions",
    "settings.sessions_desc": "You are currently logged in on 1 device.",
    "settings.logout_all": "Log out all devices",
    "settings.preferences": "App Preferences",
    "settings.notifications": "Push Notifications",
    "settings.notifications_desc": "Receive updates on your document statuses.",
    "settings.language": "Language",
    "settings.language_desc": "Select your preferred language.",
    "settings.text_size": "Accessibility (Text Size)",
    "settings.text_size_desc": "Adjust the reading size of action plans.",
    "settings.data": "Data Management",
    "settings.export": "Export Data",
    "settings.export_desc": "Download all your generated action plans as a JSON.",
    "settings.download": "Download",
    "settings.danger": "Danger Zone",
    "settings.delete": "Delete Account",
    "settings.delete_desc": "Permanently remove your profile and history.",
    "profile.title": "Your Profile",
    "profile.subtitle": "Manage your personal details and view your generated action plans.",
    "profile.name": "Display Name",
    "profile.email": "Email Address",
    "profile.free": "Free Tier",
    "profile.save": "Save",
    "profile.cancel": "Cancel",
    "profile.upgrade": "Upgrade to Premium",
    "profile.recent": "Recent Action Plans",
    "profile.saved": "Saved",
    "profile.no_plans": "No saved plans yet",
    "profile.no_plans_desc": "Generate an action plan and it will appear here automatically.",
    "profile.generated_on": "Generated on",
    "profile.view_plan": "View Plan"
  },
  hi: {
    "nav.home": "होम",
    "nav.profile": "प्रोफ़ाइल",
    "nav.settings": "सेटिंग्स",
    "nav.signin": "साइन इन",
    "nav.signout": "साइन आउट",
    "home.title": "गवगाइड एआई",
    "home.subtitle": "अपनी समस्या बताएं। हम आपको बताएंगे कि क्या करना है।",
    "home.placeholder": "अपनी समस्या बताएं (जैसे: मेरा आधार कार्ड खो गया है...)",
    "home.button": "योजना बनाएं",
    "home.suggestions": "सुझाई गई खोजें",
    "plan.summary": "कार्य योजना सारांश",
    "plan.services": "आवश्यक सरकारी सेवाएं",
    "plan.time": "प्रसंस्करण का समय",
    "plan.fee": "अनुमानित शुल्क",
    "plan.docs": "आवश्यक दस्तावेज़",
    "plan.steps": "आवेदन के चरण",
    "plan.visit": "आधिकारिक वेबसाइट पर जाएं",
    "plan.more_info": "अधिक जानकारी",
    "plan.next": "अगले कदम",
    "plan.tips": "उपयोगी टिप्स",
    "nav.feedback": "फीडबैक",
    "cat.general": "सामान्य समस्या",
    "cat.identity": "पहचान दस्तावेज़",
    "cat.family": "परिवार और विवाह",
    "cat.vehicle": "वाहन और परिवहन",
    "cat.property": "संपत्ति और आवास",
    "cat.business": "व्यापार और कर",
    "search.passport": "पासपोर्ट नवीनीकरण",
    "search.pan": "पैन कार्ड",
    "search.driving": "ड्राइविंग लाइसेंस",
    "search.aadhaar": "आधार अपडेट",
    "settings.title": "सेटिंग्स",
    "settings.subtitle": "अपनी ऐप प्राथमिकताओं, सुरक्षा और स्वरूप को प्रबंधित करें।",
    "settings.security": "सुरक्षा और गोपनीयता",
    "settings.2fa": "टू-फैक्टर ऑथेंटिकेशन (2FA)",
    "settings.2fa_desc": "अपने खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें।",
    "settings.sessions": "सक्रिय सत्र",
    "settings.sessions_desc": "आप वर्तमान में 1 डिवाइस पर लॉग इन हैं।",
    "settings.logout_all": "सभी उपकरणों से लॉग आउट करें",
    "settings.preferences": "ऐप प्राथमिकताएं",
    "settings.notifications": "पुश सूचनाएं",
    "settings.notifications_desc": "अपने दस्तावेज़ की स्थिति पर अपडेट प्राप्त करें।",
    "settings.language": "भाषा",
    "settings.language_desc": "अपनी पसंदीदा भाषा चुनें।",
    "settings.text_size": "पहुंच (टेक्स्ट आकार)",
    "settings.text_size_desc": "कार्य योजनाओं के पढ़ने के आकार को समायोजित करें।",
    "settings.data": "डेटा प्रबंधन",
    "settings.export": "डेटा निर्यात करें",
    "settings.export_desc": "अपनी सभी जेनरेट की गई कार्य योजनाओं को JSON के रूप में डाउनलोड करें।",
    "settings.download": "डाउनलोड",
    "settings.danger": "खतरे का क्षेत्र",
    "settings.delete": "खाता हटाएं",
    "settings.delete_desc": "स्थायी रूप से अपनी प्रोफ़ाइल और इतिहास हटा दें।",
    "profile.title": "आपकी प्रोफ़ाइल",
    "profile.subtitle": "अपने व्यक्तिगत विवरण प्रबंधित करें और अपनी जेनरेट की गई कार्य योजनाएं देखें।",
    "profile.name": "प्रदर्शित नाम",
    "profile.email": "ईमेल पता",
    "profile.free": "फ्री टियर",
    "profile.save": "सहेजें",
    "profile.cancel": "रद्द करें",
    "profile.upgrade": "प्रीमियम में अपग्रेड करें",
    "profile.recent": "हाल की कार्य योजनाएं",
    "profile.saved": "सहेजा गया",
    "profile.no_plans": "अभी तक कोई सहेजी गई योजना नहीं है",
    "profile.no_plans_desc": "एक कार्य योजना तैयार करें और यह यहाँ स्वचालित रूप से दिखाई देगी।",
    "profile.generated_on": "पर उत्पन्न",
    "profile.view_plan": "योजना देखें"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('govguide_lang') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'hi')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('govguide_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
