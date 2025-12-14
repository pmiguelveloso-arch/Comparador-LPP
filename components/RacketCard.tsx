
import React from 'react';
import { Link } from 'react-router-dom';
import { Racket } from '../types';
import { Plus, Check, Zap, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRacketMatch } from '../utils/matchLogic';

interface RacketCardProps {
  racket: Racket;
  showMatchScore?: boolean;
  onQuickView?: (racket: Racket) => void;
}

const RacketCard: React.FC<RacketCardProps> = ({ racket, showMatchScore = true, onQuickView }) => {
  const { addToCompare, isInCompare, compareList } = useApp();
  const isCompared = isInCompare(racket.id);
  const matchScore = getRacketMatch(racket);

  // Helper for stats bars
  const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
        <span>{label}</span>
        <span className="text-zinc-300 font-mono">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-zinc-800 rounded-sm overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${value * 10}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="group relative flex flex-col h-full bg-zinc-900 border border-zinc-800 hover:border-padel-lime transition-all duration-300 rounded-xl overflow-hidden shadow-lg">
      
      {/* Top Header - Brand & Match */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start pointer-events-none">
         <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold uppercase px-2 py-1 rounded border border-white/10 tracking-widest">
           {racket.brand}
         </span>
         
         {showMatchScore && matchScore > 0 && (
           <div className={`flex items-center gap-1 bg-padel-black border border-padel-lime px-2 py-1 rounded text-padel-lime font-mono text-xs font-bold shadow-[0_0_10px_rgba(163,230,53,0.2)]`}>
             <Zap size={10} fill="currentColor" />
             {matchScore}%
           </div>
         )}
      </div>

      {/* Image Section */}
      <div className="relative h-[220px]">
        <Link to={`/racket/${racket.id}`} className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,_#27272a_0%,_#09090b_100%)] overflow-hidden group-hover:bg-[radial-gradient(circle_at_center,_#3f3f46_0%,_#09090b_100%)] transition-colors">
          {/* Tech Grid Background */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <img 
            src={racket.image_url} 
            alt={racket.model} 
            className="relative h-[85%] object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2 z-10"
          />
        </Link>
        {onQuickView && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                onQuickView(racket);
              }}
              className="absolute bottom-3 right-3 p-2 bg-zinc-950/80 text-zinc-400 hover:text-padel-lime hover:bg-zinc-900 rounded-lg border border-white/10 backdrop-blur opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              title="Vista Rápida"
            >
              <Eye size={18} />
            </button>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-grow p-5 bg-zinc-900 border-t border-zinc-800">
        <div className="mb-4">
          <Link to={`/racket/${racket.id}`} className="hover:text-padel-lime transition-colors">
            <h3 className="font-bold text-lg text-white leading-tight uppercase italic">{racket.model}</h3>
          </Link>
          <div className="flex gap-2 mt-2">
             <span className="text-[10px] font-mono text-zinc-500 uppercase border border-zinc-700 px-1 rounded">{racket.shape}</span>
             <span className="text-[10px] font-mono text-zinc-500 uppercase border border-zinc-700 px-1 rounded">{racket.balance}</span>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
           <StatBar label="POT" value={racket.characteristics.power} color="bg-violet-500" />
           <StatBar label="CTR" value={racket.characteristics.control} color="bg-padel-lime" />
        </div>

        {/* Action Button */}
        <button 
          onClick={() => isCompared ? null : addToCompare(racket)}
          disabled={isCompared || compareList.length >= 3}
          className={`mt-auto w-full py-3 rounded text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-200 border ${
            isCompared 
              ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-default'
              : 'bg-zinc-950 text-white border-zinc-700 hover:bg-padel-lime hover:text-padel-black hover:border-padel-lime'
          }`}
        >
          {isCompared ? <Check size={14} /> : <Plus size={14} />}
          {isCompared ? 'ADICIONADO' : 'COMPARAR'}
        </button>
      </div>
    </div>
  );
};

export default RacketCard;
