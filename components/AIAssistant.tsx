
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { chatWithPadelCoach } from '../utils/aiService';
import { MessageSquare, X, Send, Bot, Minimize2, Sparkles, Loader2, ChevronRight, Lock, Battery, BatteryWarning } from 'lucide-react';
import { PlayerProfile } from '../types';

const MAX_DAILY_MESSAGES = 5;

const AIAssistant = () => {
  const { compareList } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialAnalysis, setHasInitialAnalysis] = useState(false);
  
  // Usage Limit State
  const [dailyCount, setDailyCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getProfile = (): PlayerProfile | null => {
      const saved = localStorage.getItem('player_profile');
      return saved ? JSON.parse(saved) : null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load and Reset Daily Limits
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const storedDate = localStorage.getItem('ai_usage_date');
    const storedCount = parseInt(localStorage.getItem('ai_usage_count') || '0');

    if (storedDate !== today) {
        // Reset for new day
        localStorage.setItem('ai_usage_date', today);
        localStorage.setItem('ai_usage_count', '0');
        setDailyCount(0);
    } else {
        setDailyCount(storedCount);
    }
  }, []);

  const incrementUsage = () => {
      const newCount = dailyCount + 1;
      setDailyCount(newCount);
      localStorage.setItem('ai_usage_count', newCount.toString());
  };

  const remainingCredits = Math.max(0, MAX_DAILY_MESSAGES - dailyCount);

  // Trigger initial analysis when opening with items in comparison
  useEffect(() => {
    if (isOpen && compareList.length > 0 && !hasInitialAnalysis && messages.length === 0) {
        if (remainingCredits > 0) {
            handleInitialAnalysis();
        }
    }
  }, [isOpen, compareList]);

  const handleInitialAnalysis = async () => {
      setIsLoading(true);
      setHasInitialAnalysis(true);
      const profile = getProfile();
      
      try {
          incrementUsage(); // Consume Credit
          const response = await chatWithPadelCoach(
              [{ role: 'user', text: "I have selected these rackets. Analyze them for me based on my profile." }], 
              profile, 
              compareList
          );
          
          setMessages([
              { role: 'model', text: response }
          ]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (remainingCredits <= 0) return;

    const newUserMsg = { role: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);
    incrementUsage(); // Consume Credit

    const profile = getProfile();

    try {
        const response = await chatWithPadelCoach(
            [...messages, newUserMsg],
            profile,
            compareList
        );
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the Match Engine server." }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-padel-lime text-padel-black p-4 rounded-full shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:scale-110 transition-transform group animate-bounce-slow"
        title="Ask AI Coach"
      >
        <Bot size={28} strokeWidth={2.5} />
        {compareList.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[9px] text-white items-center justify-center font-bold">
                  {compareList.length}
              </span>
            </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${isMinimized ? 'bottom-24 right-4 w-72' : 'bottom-0 sm:bottom-24 right-0 sm:right-4 w-full sm:w-[400px] h-[600px] max-h-[80vh]'}`}>
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between cursor-pointer" onClick={() => !isMinimized && setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-padel-lime rounded-lg text-padel-black">
                    <Sparkles size={18} fill="currentColor" />
                </div>
                <div>
                    <h3 className="font-black text-white uppercase italic text-sm">AI Coach</h3>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold uppercase ${remainingCredits > 0 ? 'bg-padel-lime/10 border-padel-lime/30 text-padel-lime' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                            {remainingCredits > 0 ? <Battery size={10} /> : <Lock size={10} />}
                            {remainingCredits}/{MAX_DAILY_MESSAGES} Credits
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} 
                    className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400"
                >
                    {isMinimized ? <ChevronRight size={16} className="-rotate-90" /> : <Minimize2 size={16} />}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} 
                    className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded text-zinc-400"
                >
                    <X size={16} />
                </button>
            </div>
        </div>

        {/* Minimized State just shows header essentially, but logic handles container size */}
        {!isMinimized && (
            <>
                {/* Messages Area */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-900/50">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-8 opacity-50">
                            <Bot size={48} className="mx-auto mb-4 text-zinc-600" />
                            <p className="text-sm text-zinc-400 font-mono">
                                Hi! I'm your Padel Coach. <br/>
                                {compareList.length > 0 
                                  ? "I see you're comparing rackets. Want my analysis?" 
                                  : "Ask me anything about gear, tactics, or your profile."}
                            </p>
                            <div className="mt-4 text-[10px] text-zinc-600 font-mono uppercase">
                                Daily Limit: {MAX_DAILY_MESSAGES} interactions
                            </div>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-zinc-800 text-white rounded-br-none border border-zinc-700' 
                                : 'bg-padel-lime/10 text-zinc-200 rounded-bl-none border border-padel-lime/20'
                            }`}>
                                {msg.role === 'model' && (
                                    <div className="text-[9px] font-bold text-padel-lime uppercase mb-1 flex items-center gap-1">
                                        <Bot size={10} /> Coach AI
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-padel-lime" />
                                <span className="text-xs text-zinc-500 font-mono animate-pulse">Thinking...</span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-zinc-950 border-t border-zinc-800">
                    {remainingCredits > 0 ? (
                        <>
                            {compareList.length > 0 && messages.length === 0 && !hasInitialAnalysis && (
                                <div className="mb-3 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                    <button 
                                        onClick={handleInitialAnalysis}
                                        className="whitespace-nowrap px-3 py-1.5 bg-padel-lime/10 border border-padel-lime/30 rounded-full text-[10px] font-bold text-padel-lime hover:bg-padel-lime hover:text-padel-black transition-colors uppercase"
                                    >
                                        ⚡ Compare Selected Rackets (1 Credit)
                                    </button>
                                </div>
                            )}
                            
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ask about power, control, or spin..."
                                    className="w-full bg-zinc-900 text-white text-sm rounded-xl pl-4 pr-12 py-3 border border-zinc-800 focus:border-padel-lime focus:outline-none placeholder-zinc-600"
                                />
                                <button 
                                    onClick={handleSend}
