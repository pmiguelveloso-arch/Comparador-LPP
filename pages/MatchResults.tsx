
import React, { useEffect, useState } from 'react';
import { RACKETS } from '../data/rackets';
import { PlayerProfile, Racket } from '../types';
import { getRacketMatch } from '../utils/matchLogic';
import RacketCard from '../components/RacketCard';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Activity, Zap, BarChart2, CheckCircle2, BrainCircuit, MessageSquareQuote } from 'lucide-react';

const MatchResults = () => {
  const [matches, setMatches] = useState<Racket[]>([]);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('player_profile');
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      setProfile(p);
      
      const ranked = RACKETS.map(r => ({
        ...r,
        score: getRacketMatch(r) // Attach score temporarily for sort
      }))
      .filter(r => r.score > 50) // Filter bad matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3

      setMatches(ranked);
    }
  }, []);

  // --- LOGIC: GENERATE DYNAMIC ANALYSIS ---
  const getMatchAnalysis = (racket: Racket, profile: PlayerProfile) => {
    
    // 1. THE "WHY" (Fit Reason)
    let whyFit = "Esta raquete equilibra as suas métricas gerais.";
    if (profile.injuries && profile.injuries.some(i => i !== 'None') && racket.characteristics.comfort > 7) {
        whyFit = `A elevada taxa de conforto (${racket.characteristics.comfort}/10) e o núcleo ${racket.core_type} protegem as suas articulações contra vibrações.`;
    } else if (profile.style === 'ofensivo' && racket.balance === 'alto') {
        whyFit = "O balanço alto alinha-se perfeitamente com o seu estilo ofensivo, maximizando a alavanca no smash.";
    } else if (profile.style === 'consistente' && racket.characteristics.sweetspot > 8) {
        whyFit = "O ponto doce alargado compensa erros e garante a consistência defensiva que o seu jogo exige.";
    } else if (profile.net_style === 'aggressive' && racket.characteristics.maneuverability > 7) {
        whyFit = "A manuseabilidade superior permite a rapidez de reação necessária para os seus voleios de bloqueio e ataque.";
    }

    // 2. HUMAN TRANSLATION (Tech -> Benefit)
    const translations = [];
    if (racket.shape === 'diamante') translations.push("Formato Diamante = Mais peso na cabeça para finalizar pontos.");
    if (racket.shape === 'redonda') translations.push("Formato Redondo = Mais fácil de manusear e defender.");
    if (racket.surface_type.includes('18K') || racket.surface_type.includes('12K')) translations.push("Carbono denso = Toque seco e precisão cirúrgica.");
    if (racket.surface_type.includes('Fiber') || racket.surface_type.includes('3K')) translations.push("Fibra flexível = Saída de bola fácil sem esforço.");
    if (racket.roughness === 'Sim') translations.push("Acabamento rugoso = Mais efeito nos seus slices e viboras.");
    const techTranslation = translations.slice(0, 2).join(" ");

    // 3. MICRO INSIGHT
    let insight = "";
    const powerDiff = (racket.characteristics.power || 0) - profile.power;
    
    if (powerDiff > 2) insight = "🚀 Boost de Potência: Esta raquete dá-lhe mais saída do que o seu perfil pediu, ideal para evoluir no ataque.";
    else if (racket.characteristics.control > 8) insight = "🎯 Sniper Mode: Uma extensão do braço para colocar a bola onde quiser.";
    else if (racket.price_range.includes("300")) insight = "💎 Investimento Premium: Tecnologia de topo usada no World Padel Tour.";
    else insight = "⚖️ Equilíbrio Perfeito: Uma extensão natural do seu braço.";

    return { whyFit, techTranslation, insight };
  };

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 text-center bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div className="bg-zinc-900/80 p-12 rounded-2xl border border-zinc-800 backdrop-blur-sm max-w-lg w-full">
          <Activity size={64} className="text-zinc-700 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase italic mb-2">No Profile Data</h2>
          <p className="text-zinc-500 font-mono text-sm mb-8 leading-relaxed">
            The Match Engine requires biometric and playstyle data to calculate compatibility scores.
          </p>
          <Link 
            to="/quiz" 
            className="inline-flex items-center gap-2 bg-padel-lime text-padel-black px-8 py-4 rounded font-bold uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]"
          >
            Launch Assessment <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-padel-lime/10 blur-[100px] rounded-full -z-10"></div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-padel-lime text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
            <Zap size={12} fill="currentColor" /> Match Algorithm v2.0
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none max-w-full break-words">
            Optimal <span className="text-transparent bg-clip-text bg-gradient-to-r from-padel-lime to-green-600">Gear Match</span>
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono text-zinc-400 mt-4">
             <span className="bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                STYLE: <span className="text-white uppercase font-bold">{profile.style}</span>
             </span>
             <span className="hidden md:inline text-zinc-600">|</span>
             <span className="bg-zinc-900 px-3 py-1 rounded border border-zinc-800">
                LEVEL: <span className="text-white uppercase font-bold">{profile.experience}</span>
             </span>
          </div>
        </div>

        {/* Results Grid - Linear Order 1-2-3 */}
        <div className="grid md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {matches.map((racket, index) => {
            const analysis = getMatchAnalysis(racket, profile);
            
            return (
            <div key={racket.id} className="relative group flex flex-col h-full">
              
              {/* Rank Number & Badge */}
              <div className="flex items-center justify-between mb-4 px-2">
                 <div className={`text-5xl font-black italic tracking-tighter ${index === 0 ? 'text-padel-lime' : 'text-zinc-800 group-hover:text-zinc-700'}`}>
                    #{index + 1}
                 </div>
                 {index === 0 && (
                    <div className="bg-padel-lime text-padel-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                        <Trophy size={12} /> Best Fit
                    </div>
                 )}
              </div>
              
              {/* Card Container */}
              <div className={`transform transition-all duration-300 ${index === 0 ? 'scale-105 ring-2 ring-padel-lime ring-offset-4 ring-offset-padel-black shadow-2xl shadow-padel-lime/10 mb-8' : 'hover:scale-102 mb-4'}`}>
                  <div className={`rounded-xl h-[420px] ${index === 0 ? 'bg-zinc-900' : 'bg-zinc-900/50'}`}>
                    <RacketCard racket={racket} showMatchScore={true} />
                  </div>
              </div>

              {/* DYNAMIC ANALYSIS PANEL */}
              <div className={`flex-grow mt-4 p-5 rounded-xl border flex flex-col gap-4 ${index === 0 ? 'bg-zinc-900/80 border-padel-lime/30' : 'bg-zinc-900/40 border-zinc-800'}`}>
                  
                  {/* 1. WHY */}
                  <div>
                      <div className="flex items-center gap-2 mb-2 text-padel-lime">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Porquê esta escolha?</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                          {analysis.whyFit}
                      </p>
                  </div>

                  {/* 2. TRANSLATION */}
                  <div>
                      <div className="flex items-center gap-2 mb-2 text-blue-400">
                          <BrainCircuit size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Tradução Técnica</span>
                      </div>
                      <p className="text-xs text-zinc-400 font-mono leading-relaxed">
                          {analysis.techTranslation}
                      </p>
                  </div>

                  {/* 3. INSIGHT */}
                  <div className="mt-auto pt-4 border-t border-white/5">
                      <div className="flex items-start gap-2 text-zinc-300">
                          <MessageSquareQuote size={16} className="text-zinc-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs italic font-bold text-white">
                              "{analysis.insight}"
                          </p>
                      </div>
                  </div>

              </div>

            </div>
          )})}
        </div>
        
        {/* Footer Action */}
        <div className="mt-20 flex flex-col items-center">
           <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent mb-6"></div>
           <Link 
             to="/explore" 
             className="group flex items-center gap-4 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-padel-lime transition-all"
           >
              <div className="p-2 bg-zinc-950 rounded text-padel-lime group-hover:scale-110 transition-transform">
                 <BarChart2 size={24} />
              </div>
              <div className="text-left">
                 <div className="text-white font-bold uppercase text-sm tracking-wide group-hover:text-padel-lime transition-colors">Browse Full Database</div>
                 <div className="text-zinc-500 text-[10px] font-mono">COMPARE OTHER MODELS MANUALLY</div>
              </div>
              <ArrowRight className="text-zinc-600 group-hover:text-white transition-colors" />
           </Link>
        </div>

      </div>
    </div>
  );
};

export default MatchResults;
