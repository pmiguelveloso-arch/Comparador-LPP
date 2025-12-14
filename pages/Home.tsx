
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, BarChart2, Plus, ArrowUpRight, Award } from 'lucide-react';
import { RACKETS } from '../data/rackets';
import RacketCard from '../components/RacketCard';

const Home = () => {
  // Filter for Editor's Choice (Trending) rackets
  const trendingRackets = RACKETS.filter(r => r.isTrending).slice(0, 3);
  
  // Fallback to first 3 if no trending rackets defined
  const featuredRackets = trendingRackets.length > 0 ? trendingRackets : RACKETS.slice(0, 3);
  
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setProfileExists(!!localStorage.getItem('player_profile'));
    }
  }, []);

  return (
    <div className="min-h-screen pt-20 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-1">Bem-vindo de volta</h2>
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
              Painel do <span className="text-padel-lime">Jogador</span>
            </h1>
          </div>
          <div className="flex gap-2">
            {!profileExists ? (
              <Link 
                to="/quiz" 
                className="flex items-center gap-2 bg-padel-lime text-padel-black px-6 py-3 rounded font-bold uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                <Plus size={18} strokeWidth={3} /> Nova Análise
              </Link>
            ) : (
               <Link 
                to="/match" 
                className="flex items-center gap-2 bg-white text-padel-black px-6 py-3 rounded font-bold uppercase tracking-wide hover:bg-zinc-200 transition"
              >
                <Target size={18} strokeWidth={3} /> Ver Resultados
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          
          {/* Main Action Card (Quiz) */}
          <div className="md:col-span-8 relative group overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800">
            <div className="absolute inset-0 bg-gradient-to-r from-padel-black/80 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop" 
              alt="Padel Court" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-20 p-8 h-full flex flex-col justify-between min-h-[300px]">
              <div className="flex items-start justify-between">
                 <div className="bg-padel-lime/20 text-padel-lime px-3 py-1 rounded text-[10px] font-bold font-mono uppercase border border-padel-lime/30">
                   Análise IA
                 </div>
                 <ArrowUpRight className="text-white opacity-50 group-hover:text-padel-lime group-hover:opacity-100 transition-all" />
              </div>
              
              <div>
                <h3 className="text-3xl font-black text-white uppercase italic mb-2">Encontra a Tua Arma</h3>
                <p className="text-zinc-400 max-w-md mb-6 font-mono text-sm">
                  Completa o teste biométrico de performance para desbloquear recomendações personalizadas baseadas no teu estilo.
                </p>
                <Link to="/quiz" className="inline-flex items-center gap-2 text-white font-bold hover:text-padel-lime transition-colors uppercase tracking-wide text-sm border-b border-white/20 pb-1 hover:border-padel-lime">
                  Iniciar Avaliação <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Side Stats Cards */}
          <div className="md:col-span-4 flex flex-col gap-6">
            
            {/* Database Stat */}
            <div className="flex-1 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:border-padel-lime/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-zinc-950 rounded-lg text-zinc-500 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <span className="text-zinc-600 text-[10px] font-mono uppercase">Dados em Tempo Real</span>
              </div>
              <div className="text-4xl font-black text-white font-mono">{RACKETS.length}</div>
              <div className="text-zinc-500 text-xs font-bold uppercase mt-1">Modelos Pro Indexados</div>
            </div>

            {/* Catalog Link */}
            <Link to="/explore" className="flex-1 bg-zinc-900 rounded-2xl p-6 border border-zinc-800 hover:bg-zinc-800 transition-colors group flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="p-3 bg-zinc-950 rounded-lg text-padel-lime">
                    <BarChart2 size={24} />
                 </div>
                 <ArrowRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                 <div className="text-xl font-bold text-white uppercase italic">Raquetes</div>
                 <div className="text-zinc-500 text-xs font-mono mt-1">VER CATÁLOGO COMPLETO</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
            <span className="w-2 h-6 bg-padel-lime skew-x-[-12deg] block"></span>
            <span className="flex items-center gap-2">
               Escolha do Editor <Award size={18} className="text-padel-lime" />
            </span>
          </h3>
          <Link to="/explore" className="text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-wider">Ver Tudo</Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRackets.map(racket => (
             <div key={racket.id} className="h-[400px]">
               <RacketCard racket={racket} showMatchScore={false} />
             </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
