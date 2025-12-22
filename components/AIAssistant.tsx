
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { chatWithPadelCoach } from '../utils/aiService';
import { MessageSquare, X, Send, Bot, Minimize2, Sparkles, Loader2, ChevronRight, Lock, Battery } from 'lucide-react';
import { PlayerProfile } from '../types';

const MAX_DAILY_MESSAGES = 10;

const AIAssistant = () => {
  const { compareList } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialAnalysis, setHasInitialAnalysis] = useState(false);
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

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('ai_usage_date');
    const storedCount = parseInt(localStorage.getItem('ai_usage_count') || '0');

    if (storedDate !== today) {
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
          incrementUsage();
          const response = await chatWithPadelCoach(
              [{ role: 'user', text: "Analisa as raquetes que selecionei para comparação com base no meu perfil." }], 
              profile, 
              compareList
          );
          
          setMessages([{ role: 'model', text: response }]);
      } catch (e) {
          console.error(e);
      } finally {
          setIsLoading(false);
      }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || remainingCredits <= 0 || isLoading) return;

    const newUserMsg = { role: 'user' as const, text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);
    incrementUsage();

    const profile = getProfile();

    try {
        const response = await chatWithPadelCoach(
            [...messages, newUserMsg],
            profile,
            compareList
        );
        setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'model', text: "Ocorreu um erro na ligação ao Coach IA." }]);
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
        className="fixed bottom-24 right-4 z-40 bg-padel-lime text-padel-black p-4 rounded-full shadow-[0_0_30px_rgba(163,230,53,0.5)] hover:scale-110 transition-transform group animate-pulse"
      >
        <Bot size={28} strokeWidth={2.5} />
        {compareList.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 bg-white rounded-full items-center justify-center text-[10px] font-black border-2 border-padel-black text-padel-black">
                {compareList.length}
            </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed z-50 transition-all duration-300 ${isMinimized ? 'bottom-24 right-4 w-72' : 'bottom-0 sm:bottom-24 right-0 sm:right-4 w-full sm:w-[420px] h-[600px] max-h-[85vh]'}`}>
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700 shadow-2xl rounded-t-2xl sm:rounded-2xl flex flex-col h-full overflow-hidden">
        
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between cursor-pointer" onClick={() => !isMinimized && setIsMinimized(!isMinimized)}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-padel-lime rounded-lg text-padel-black">
                    <Sparkles size={18} fill="currentColor" />
                </div>
                <div>
                    <h3 className="font-black text-white uppercase italic text-sm">Treinador Virtual</h3>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold uppercase ${remainingCredits > 0 ? 'bg-padel-lime/10 border-padel-lime/30 text-padel-lime' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                            <Battery size={10} /> {remainingCredits} Perguntas
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400">
                    {isMinimized ? <ChevronRight size={16} className="-rotate-90" /> : <Minimize2 size={16} />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); setIsMinimized(false); }} className="p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded text-zinc-400">
                    <X size={16} />
                </button>
            </div>
        </div>

        {!isMinimized && (
            <>
                <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-zinc-900/50">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center py-12 opacity-50">
                            <Bot size={48} className="mx-auto mb-4 text-zinc-700" />
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                                Olá! Sou o teu coach Loucos por Padel.<br/>Como posso ajudar a evoluir o teu jogo hoje?
                            </p>
                        </div>
                    )}
                    
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-zinc-800 text-white rounded-br-none border border-zinc-700 shadow-xl' 
                                : 'bg-zinc-950 text-zinc-200 rounded-bl-none border border-white/5 shadow-inner'
                            }`}>
                                {msg.role === 'model' && (
                                    <div className="text-[9px] font-black text-padel-lime uppercase mb-2 flex items-center gap-1 tracking-widest">
                                        <Bot size={12} /> Coach IA
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap font-sans text-xs md:text-sm">{msg.text}</div>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="bg-zinc-950 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-padel-lime" />
                                <span className="text-[10px] text-zinc-500 font-mono uppercase animate-pulse tracking-widest">A analisar táctica...</span>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                    {remainingCredits > 0 ? (
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Dúvidas sobre potência, balanço ou táctica..."
                                className="w-full bg-zinc-900 text-white text-xs rounded-xl pl-4 pr-12 py-4 border border-zinc-800 focus:border-padel-lime focus:outline-none placeholder-zinc-700 transition-all"
                            />
                            <button 
                                onClick={handleSend}
                                className="absolute right-2 p-2 bg-padel-lime text-padel-black rounded-lg hover:bg-lime-400 transition-all shadow-lg"
                            >
                                <Send size={18} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-2 text-red-500 text-[10px] font-black uppercase flex items-center justify-center gap-2 tracking-widest">
                            Limite Diário Atingido. Volta amanhã!
                        </div>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
