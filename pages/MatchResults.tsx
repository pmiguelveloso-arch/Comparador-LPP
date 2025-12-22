
import { useEffect, useState } from 'react';
import { RACKETS } from '../data/rackets';
import { PlayerProfile, Racket } from '../types';
import { getRacketMatch } from '../utils/matchLogic';
import RacketCard from '../components/RacketCard';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Sparkles, Zap, Info, Layers, UserPlus, BookmarkCheck, History, Cloud, MessageSquare, ChevronRight } from 'lucide-react';
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
      
      // Calcular matches para todas as raquetes e ordenar
      const ranked = [...RACKETS]
        .map(r => ({ 
          racket: r, 
          score: getRacketMatch(r) 
        }))
        // Ordenar por score descendente
        .sort((a, b) => b.score - a.score)
        // Pegar sempre as 3 melhores, independentemente do score mínimo
        .slice(0, 3);

      setMatches(ranked);
    }
  }, []);

  const getReasoning = (racket: Racket, p: PlayerProfile) => {
    const reasons = [];
    if (p.injuries?.some(i => i !== 'None') && racket.characteristics.comfort >= 7) {
      reasons.push("Proteção extra para as tuas lesões.");
    }
    if (p.style === 'ofensivo' && racket.characteristics.power >= 8) {
      reasons.push("Explosividade máxima na víbora.");
    }
    if (p.style === 'consistente' && racket.characteristics.control >= 8) {
      reasons.push("Precisão total na chiquita.");
    }
    if (racket.shape === 'diamante' && p.position === 'esquerda') {
      reasons.push("Ideal para o teu jogo de ataque.");
    }
    if (racket.balance === 'baixo' && p.style === 'consistente') {
      reasons.push("Maneabilidade para controlar o ritmo.");
    }
    
    // Fallback se não houver razões específicas
    if (reasons.length === 0) {
      reasons.push("Equilíbrio ideal para o teu nível.");
      reasons.push("Performance consistente em campo.");
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
            Não conseguimos calcular o teu match sem o quiz.
          </p>
          <Link to="/quiz" className="inline-flex items-center gap-2 bg-padel-lime text-padel-black px-8 py-4 rounded font-bold uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]">
            Fazer Scouting Agora <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section - Fiel à imagem */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-padel-lime uppercase tracking-[0.4em] font-bold">Scouting Report</span>
              <div className="h-px w-12 bg-zinc-800"></div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
              O TEU <span className="text-padel-lime">MATCH IDEAL</span>
            </h1>
            <p className="text-zinc-600 font-bold text-xs mt-3 font-mono uppercase tracking-[0.2em]">
              Análise de Performance v2.5
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
             <button 
                onClick={() => {
                  matches.forEach(m => addToCompare(m.racket));
                }}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:border-padel-lime transition-all w-full md:w-auto group"
             >
                <Layers size={16} className="text-padel-lime group-hover:scale-110 transition-transform" /> 
                Comparar Top 3
             </button>
          </div>
        </div>

        {/* VEREDITO DO TREINADOR */}
        {profile.aiAnalysis && (
          <div className="mb-16 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 backdrop-blur-md">
            <div className="flex-shrink-0 relative">
               <div className="w-20 h-20 bg-padel-lime rounded-2xl flex items-center justify-center text-padel-black shadow-[0_0_40px_rgba(163,230,53,0.2)]">
                 <Zap size={44} fill="currentColor" />
               </div>
            </div>
            
            <div className="hidden md:block w-px h-20 bg-padel-lime/20"></div>
            
            <div className="flex-grow">
               <h3 className="text-[10px] font-black text-white uppercase italic mb-4 tracking-[0.3em] flex items-center gap-2">
                 <span className="w-2 h-2 bg-padel-lime rounded-full animate-pulse"></span>
                 Veredito do Treinador Loucos por Padel
               </h3>
               <p className="text-zinc-200 text-lg md:text-2xl font-medium leading-relaxed italic pr-4">
                 "{profile.aiAnalysis}"
               </p>
            </div>
            
            <div className="absolute right-0 top-0 p-4 opacity-[0.03] pointer-events-none translate-x-12 translate-y-[-20px]">
               <MessageSquare size={240} />
            </div>
          </div>
        )}

        {/* RESULTS GRID - AS 3 MELHORES SUGESTÕES */}
        <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
                <h3 className="text-xl font-black text-white uppercase italic tracking-widest">Equipamento Selecionado</h3>
                <div className="h-px flex-grow bg-zinc-900"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {matches.map(({racket, score}, index) => {
                const isBest = index === 0;
                const reasons = getReasoning(racket, profile);

                return (
                <div key={racket.id} className="flex flex-col animate-fade-in-up h-full" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-3">
                        <span className={`text-5xl font-black italic tracking-tighter ${isBest ? 'text-padel-lime' : 'text-zinc-800'}`}>
                            #{index + 1}
                        </span>
                        {isBest && (
                            <div className="bg-padel-lime/10 text-padel-lime border border-padel-lime/30 px-3 py-1 rounded font-black uppercase text-[9px] tracking-widest flex items-center gap-1 shadow-lg">
                            <Sparkles size={10} /> Sugestão Elite
                            </div>
                        )}
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1">Match Score</div>
                        <div className={`text-2xl font-black font-mono leading-none ${isBest ? 'text-padel-lime' : 'text-white'}`}>{score}%</div>
                    </div>
                    </div>
                    
                    <div className={`flex-grow flex flex-col transition-all duration-500 bg-zinc-900/40 rounded-[2rem] border border-zinc-800 overflow-hidden group hover:border-padel-lime/50 shadow-2xl relative ${isBest ? 'ring-1 ring-padel-lime/30' : ''}`}>
                    
                    <div className="h-[360px] relative">
                        <RacketCard racket={racket} showMatchScore={false} />
                    </div>
                    
                    <div className="p-8 bg-zinc-950/80 flex-grow flex flex-col border-t border-zinc-800/50 backdrop-blur-sm">
                        <div className="space-y-4 mb-8 flex-grow">
                            {reasons.map((reason, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-padel-lime shadow-[0_0_8px_rgba(163,230,53,0.6)]"></div>
                                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider leading-relaxed">{reason}</span>
                            </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <div className="text-[9px] text-zinc-500 font-mono uppercase mb-1 tracking-widest">Foco Principal</div>
                            <div className="text-xs font-black text-white uppercase italic">
                                {racket.characteristics.power >= racket.characteristics.control ? 'Ataque Letal' : 'Controlo Total'}
                            </div>
                            </div>
                            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <div className="text-[9px] text-zinc-500 font-mono uppercase mb-1 tracking-widest">Nível Pro</div>
                            <div className="text-xs font-black text-white uppercase italic">
                                {racket.targetPlayer?.split(' ')[0] || 'Avançado'}
                            </div>
                            </div>
                        </div>

                        <Link to={`/racket/${racket.id}`} className="mt-6 w-full py-4 bg-white hover:bg-padel-lime text-padel-black font-black uppercase text-[10px] tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-xl">
                            Relatório Técnico <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    </div>
                </div>
                );
            })}
            </div>
        </div>

        {/* CTA SECTION - GUARDAR RESULTADO */}
        {!isAuthenticated && (
          <div className="mt-20 animate-fade-in-up">
            <div className="bg-gradient-to-br from-padel-lime/10 via-zinc-900 to-zinc-950 rounded-[2.5rem] border border-padel-lime/20 p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
               <div className="relative z-10 flex-shrink-0 text-center md:text-left">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-padel-black mx-auto md:mx-0 mb-6 shadow-2xl rotate-3">
                    <UserPlus size={40} />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                    GUARDA ESTE <span className="text-padel-lime">PROGRESSO</span>
                  </h2>
                  <p className="text-zinc-400 font-medium text-sm mt-4 max-w-sm font-mono uppercase tracking-widest">
                    Cria o teu perfil para associar estes matches e desbloquear a análise comparativa avançada.
                  </p>
               </div>
               
               <div className="flex-grow"></div>
               
               <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                  <Link to="/register" className="flex items-center justify-center gap-3 px-10 py-5 bg-padel-lime text-padel-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-2xl">
                    CRIAR PERFIL DE ATLETA <ArrowRight size={18} strokeWidth={3} />
                  </Link>
               </div>

               {/* Background Decorative */}
               <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-padel-lime/5 blur-[100px] rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResults;
