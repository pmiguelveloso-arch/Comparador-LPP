import React, { useEffect, useState } from 'react';
import { RACKETS } from '../data/rackets';
import { PlayerProfile, Racket } from '../types';
import { getRacketMatch } from '../utils/matchLogic';
import RacketCard from '../components/RacketCard';
import { Link } from 'react-router-dom';
import { Trophy, ArrowRight, Activity, Zap, BarChart2 } from 'lucide-react';

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
          {matches.map((racket, index) => (
            <div key={racket.id} className="relative group">
              
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
              <div className={`transform transition-all duration-300 ${index === 0 ? 'scale-105 ring-2 ring-padel-lime ring-offset-4 ring-offset-padel-black shadow-2xl shadow-padel-lime/10' : 'hover:scale-102'}`}>
                  <div className={`rounded-xl h-[420px] ${index === 0 ? 'bg-zinc-900' : 'bg-zinc-900/50'}`}>
                    <RacketCard racket={racket} showMatchScore={true} />
                  </div>
              </div>

            </div>
          ))}
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