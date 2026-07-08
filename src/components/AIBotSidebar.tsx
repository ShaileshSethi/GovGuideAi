/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isCard?: boolean;
  serviceData?: {
    name: string;
    time: string;
    fee: string;
    link: string;
  };
};

export default function AIBotSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hello! I am your GovGuide AI Assistant. How can I help you with government services or procedures today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

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
      setInput(transcript);
    };
    recognition.onerror = (event: any) => {
      toast.error('Microphone error: ' + event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, language }),
      });

      if (!response.ok) throw new Error("API failed");
      
      const data = await response.json();
      
      setIsTyping(false);

      if (data.text) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'bot',
          text: data.text
        }]);
      }

      if (data.hasCard && data.serviceData) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.serviceData.name,
          isCard: true,
          serviceData: data.serviceData
        }]);
      }
      
    } catch (error) {
      setIsTyping(false);
      toast.error("Failed to connect to AI Assistant.");
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting to the network right now.'
      }]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 z-[60] h-full w-full sm:w-[450px] bg-white/20 backdrop-blur-2xl border-l border-white/40 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 bg-card/40 backdrop-blur-md">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30 mr-4 shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Assistant</h2>
                <p className="text-xs text-muted-foreground font-medium">GovGuide Support</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && !msg.isCard && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-1 flex-shrink-0 border border-primary/30">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                  )}
                  
                  {msg.isCard && msg.serviceData ? (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="ml-11 max-w-[90%] bg-white/60 backdrop-blur-xl border border-white/50 p-4 rounded-2xl shadow-sm group"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center mb-3">
                          <span className="text-2xl mr-3 bg-white/50 p-1.5 rounded-xl">📘</span>
                          <h4 className="font-bold text-foreground leading-tight">{msg.serviceData.name}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium mb-3">Time: {msg.serviceData.time} • Fee: {msg.serviceData.fee}</p>
                        <a 
                          href={msg.serviceData.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full py-2.5 rounded-xl font-bold text-sm transition-colors text-center flex items-center justify-center shadow-sm"
                        >
                          View Portal <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <div 
                      className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-primary/20 border border-primary/30 text-foreground rounded-tr-sm' 
                          : 'bg-white/40 border border-white/50 text-foreground rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start items-center"
              >
                 <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-3 mt-1 flex-shrink-0 border border-primary/30">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div className="bg-white/40 border border-white/50 px-4 py-4 rounded-2xl rounded-tl-sm flex flex-col space-y-3 shadow-sm min-w-[120px]">
                  <motion.div 
                    animate={{ opacity: [0.3, 0.7, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} 
                    className="h-2.5 w-full bg-primary/40 rounded-full" 
                  />
                  <motion.div 
                    animate={{ opacity: [0.3, 0.7, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, ease: "easeInOut" }} 
                    className="h-2.5 w-2/3 bg-primary/30 rounded-full" 
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/20 bg-card/40 backdrop-blur-md pb-8 sm:pb-4">
            <form onSubmit={handleSend} className="relative flex items-center bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm p-1.5 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <div className="flex-1 flex items-center relative">
                <button
                  type="button"
                  onClick={startListening}
                  className={`p-2 rounded-xl transition-all duration-300 ${isListening ? 'bg-red-100/80 text-red-600 animate-pulse' : 'text-muted-foreground hover:text-primary hover:bg-white/50'}`}
                  title="Click to speak"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-transparent py-2.5 px-3 text-foreground placeholder-muted-foreground focus:outline-none text-sm font-medium"
                  disabled={isTyping}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white p-2.5 rounded-xl transition-transform active:scale-95 ml-1 shadow-sm"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
