
import React, { useEffect, useState } from 'react';
import { RACKETS } from '../data/rackets';
import { PlayerProfile, Racket } from '../types';
import { getRacketMatch } from '../utils/matchLogic';
import RacketCard from '../components/RacketCard';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Sparkles, Zap, Info, MessageSquareQuote, Layers, UserPlus, BookmarkCheck, History, Cloud } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const MatchResults = () => {
  const [matches, setMatches] = useState<{racket: Racket, score: number}[]>([]);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const { addToCompare } = useApp();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const savedProfile = localStorage.getItem('player_profile');
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      const ranked = [...RACKETS]
        .map(r => ({ racket: r, score: getRacketMatch(r) }))
        .filter(item => item.score > 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      setMatches(ranked);
    }
  }, []);

  const getReasoning = (racket: Racket, p: PlayerProfile) => {
    const reasons = [];
    if (p.injuries?.some(i => i !== 'None') && racket.characteristics.comfort >= 7) {
      reasons.push("Proteção extra para as tuas articulações.");
    }
    if (p.style === 'ofensivo' && racket.characteristics.power >= 8) {
      reasons.push("Maximiza a força nos teus remates.");
    }
    if (p.style === 'consistente' && racket.characteristics.control >= 8) {
      reasons.push("Precisão total para controlar o ritmo do jogo.");
    }
    if (p.position === 'esquerda' && racket.balance === 'alto') {
      reasons.push("Ideal para ganhar pontos na rede.");
    }
    if (p.position === 'direita' && racket.balance !== 'alto') {
      reasons.push("Equilíbrio perfeito para defender e colocar a bola.");
    }
    if (racket.characteristics.sweetspot >= 8) {
      reasons.push("Ponto doce amplo para facilitar o teu jogo.");
    }
    return reasons.slice(0, 2);
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 text-center bg-padel-black">
        <div className="bg-zinc-900/80 p-12 rounded-2xl border border-zinc-800 backdrop-blur-sm max-w-lg w-full shadow-2xl">
          <Activity size={64} className="text-zinc-700 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase italic mb-2 tracking-tighter">Ops! Falta o Perfil</h2>
          <p className="text-zinc-500 font-mono text-sm mb-8 uppercase tracking-widest">
            Não conseguimos calcular o teu match sem saber como jogas.
          </p>
          <Link to="/quiz" className="inline-flex items-center gap-2 bg-padel-lime text-padel-black px-8 py-4 rounded font-bold uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            Fazer Teste de 1 Minuto <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-padel-lime/10 blur-[60px] rounded-full -z-10"></div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-padel-lime uppercase tracking-[0.3em]">Scouting Report</span>
              <div className="h-px w-12 bg-zinc-800"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">
              O teu <span className="text-padel-lime">Match Ideal</span>
            </h1>
            <p className="text-zinc-500 font-medium text-sm mt-2">Analisámos o teu estilo de jogo e estas são as raquetes que vão elevar o teu nível.</p>
          </div>

          <div className="flex gap-3">
             <button 
                onClick={() => {
                  matches.forEach(m => addToCompare(m.racket));
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold uppercase tracking-widest hover:border-padel-lime transition-all"
             >
                <Layers size={16} /> Comparar Top 3
             </button>
          </div>
        </div>

        {/* AI Coach Verdict Summary */}
        {profile.aiAnalysis && (
          <div className="mb-12 bg-zinc-900/40 rounded-3xl border border-zinc-800 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <MessageSquareQuote size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-padel-lime rounded-2xl flex items-center justify-center text-padel-black shadow-[0_0_30px_rgba(163,230,53,0.2)]">
                  <Zap size={32} fill="currentColor" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic mb-2 flex items-center gap-2">
                  Veredito do Treinador Loucos por Padel
                </h3>
                <p className="text-zinc-300 text-base md:text-lg font-medium leading-relaxed italic border-l-2 border-padel-lime pl-6">
                  "{profile.aiAnalysis}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch mb-16">
          {matches.map(({racket, score}, index) => {
            const isBest = index === 0;
            const reasons = getReasoning(racket, profile);

            return (
              <div key={racket.id} className="flex flex-col animate-fade-in-up h-full" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex items-center justify-between mb-4 px-2">
                   <div className="flex items-center gap-3">
                      <span className={`text-4xl font-black italic tracking-tighter ${isBest ? 'text-padel-lime' : 'text-zinc-800'}`}>
                        #{index + 1}
                      </span>
                      {isBest && (
                        <span className="bg-padel-lime/10 text-padel-lime border border-padel-lime/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                          <Sparkles size={12} /> Sugestão Pro
                        </span>
                      )}
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">Compatibilidade</div>
                      <div className={`text-xl font-black font-mono ${score > 85 ? 'text-padel-lime' : 'text-white'}`}>{score}%</div>
                   </div>
                </div>
                
                <div className={`flex-grow flex flex-col transition-all duration-300 bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden group hover:border-padel-lime/50 shadow-2xl ${isBest ? 'ring-2 ring-padel-lime/20' : ''}`}>
                   <div className="h-[380px]">
                      <RacketCard racket={racket} showMatchScore={false} />
                   </div>
                   
                   <div className="p-6 bg-zinc-950/50 flex-grow flex flex-col border-t border-zinc-800">
                      <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Info size={12} /> Porquê esta raquete?
                      </h4>
                      
                      <div className="space-y-3 mb-6 flex-grow">
                        {reasons.map((reason, i) => (
                          <div key={i} className="flex items-start gap-3 text-zinc-300">
                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-padel-lime shadow-[0_0_8px_rgba(163,230,53,0.8)]"></div>
                            <span className="text-xs font-bold uppercase tracking-wide leading-relaxed">{reason}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                           <div className="text-[9px] text-zinc-500 font-mono uppercase mb-1">Ponto Forte</div>
                           <div className="text-[11px] font-black text-white uppercase italic">
                              {racket.characteristics.power >= racket.characteristics.control ? 'Potência Bruta' : 'Controlo Total'}
                           </div>
                        </div>
                        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                           <div className="text-[9px] text-zinc-500 font-mono uppercase mb-1">Nível</div>
                           <div className="text-[11px] font-black text-white uppercase italic">
                              {racket.targetPlayer?.split('/')[0] || 'Intermédio'}
                           </div>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AUTH CALL TO ACTION - New Section */}
        {!isAuthenticated && (
          <div className="mb-16 animate-fade-in-up">
            <div className="bg-gradient-to-br from-padel-lime/20 to-zinc-900 rounded-3xl border border-padel-lime/30 p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-[0_0_50px_rgba(163,230,53,0.05)]">
               {/* Decorative background icons */}
               <div className="absolute -bottom-10 -right-10 text-padel-lime/10 opacity-20 pointer-events-none">
                  <BookmarkCheck size={200} />
               </div>
               
               <div className="flex-shrink-0 text-center md:text-left">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-padel-black mx-auto md:mx-0 mb-4 shadow-xl">
                    <UserPlus size={32} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight">Guarda este <span className="text-padel-lime">Resultado</span></h2>
                  <p className="text-zinc-400 font-medium text-sm mt-2 max-w-sm">Não percas o teu perfil técnico. Regista-te para associar este match à tua conta e desbloquear ferramentas pro.</p>
               </div>

               <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: History, text: "Histórico de Scouting" },
                    { icon: Cloud, text: "Acesso em qualquer lado" },
                    { icon: Sparkles, text: "Análise IA Persistente" },
                    { icon: BookmarkCheck, text: "Lista de Favoritos" }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 bg-zinc-950/40 p-3 rounded-xl border border-white/5">
                       <benefit.icon size={16} className="text-padel-lime" />
                       <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{benefit.text}</span>
                    </div>
                  ))}
               </div>

               <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-auto">
                  <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-padel-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-padel-lime transition-all shadow-xl">
                    Criar Conta Grátis <ArrowRight size={16} />
                  </Link>
                  <p className="text-[10px] text-center text-zinc-500 font-mono uppercase">Demora apenas 30 segundos</p>
               </div>
            </div>
          </div>
        )}
        
        {/* Footer Actions & Navigation */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12 border-t border-zinc-900 pt-12">
           <Link to="/explore" className="group flex items-center gap-4 px-8 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl hover:border-white transition-all">
              <div className="text-left">
                 <div className="text-zinc-300 font-bold uppercase text-xs tracking-wider">Ainda tens dúvidas?</div>
                 <div className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">Explora todo o catálogo de raquetes</div>
              </div>
              <ArrowRight className="text-zinc-700 group-hover:text-white transition-all" />
           </Link>
           
           <Link to="/quiz" className="flex items-center gap-2 px-8 py-4 bg-zinc-900 text-white border border-zinc-800 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-all">
              Refazer Avaliação <Activity size={16} />
           </Link>
        </div>

        {/* Quick Comparison Section */}
        <div className="mt-24 text-center">
            <h2 className="text-2xl font-black text-white uppercase italic mb-8 flex items-center justify-center gap-3">
               <span className="w-8 h-px bg-zinc-800"></span>
               Ver Comparação Técnica
               <span className="w-8 h-px bg-zinc-800"></span>
            </h2>
            <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex -space-x-4">
                   {matches.map(m => (
                     <div key={m.racket.id} className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-zinc-800 overflow-hidden flex items-center justify-center p-2 shadow-xl hover:translate-y-[-4px] transition-transform">
                        <img src={m.racket.image_url} alt={m.racket.model} className="w-full h-full object-contain" />
                     </div>
                   ))}
                </div>
                <div className="text-center md:text-left flex-grow max-w-sm">
                   <h4 className="text-white font-bold uppercase text-sm mb-1 italic">Analisa os dados lado a lado</h4>
                   <p className="text-zinc-500 text-xs font-mono uppercase leading-relaxed">
                      Vê como a potência, controlo e conforto se comparam entre as tuas 3 melhores opções.
                   </p>
                </div>
                <Link to="/compare" className="px-8 py-4 bg-padel-lime text-padel-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-lime-400 transition-all">
                  Abrir Matriz de Comparação
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MatchResults;
