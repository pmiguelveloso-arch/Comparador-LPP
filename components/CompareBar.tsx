import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { X, ArrowRight, Layers, Trash2 } from 'lucide-react';

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useApp();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-fade-in-up">
      <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] rounded-2xl p-3 sm:p-4 flex items-center justify-between">
        
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-3 text-padel-lime px-2 border-r border-zinc-800 pr-4">
             <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800">
                <Layers size={18} />
             </div>
             <div className="hidden sm:block">
                <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest leading-none mb-1">Matrix</div>
                <span className="font-bold text-xs uppercase tracking-wide text-white">Active</span>
             </div>
          </div>
          
          <div className="flex gap-2">
            {compareList.map((racket) => (
              <div key={racket.id} className="relative group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center p-1 group-hover:border-padel-lime/50 transition-colors">
                  <img src={racket.image_url} alt={racket.model} className="w-full h-full object-contain" />
                </div>
                <button 
                  onClick={() => removeFromCompare(racket.id)} 
                  className="absolute -top-2 -right-2 bg-zinc-900 text-zinc-500 hover:text-red-500 hover:border-red-500 border border-zinc-700 rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-lg"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
            {Array.from({ length: 3 - compareList.length }).map((_, i) => (
               <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-zinc-900/30 border border-dashed border-zinc-800 flex items-center justify-center">
                  <span className="text-zinc-700 text-[10px] font-mono font-bold">{i + 1 + compareList.length}</span>
               </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
           <button 
             onClick={clearCompare} 
             className="hidden sm:flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
             title="Clear Selection"
           >
             <Trash2 size={12} /> Clear
           </button>
           
           <Link 
             to="/compare" 
             className="flex items-center gap-2 bg-padel-lime text-padel-black hover:bg-lime-300 px-4 sm:px-6 py-3 rounded-xl font-black uppercase text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(163,230,53,0.15)] hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:scale-105 active:scale-95"
           >
             <span className="hidden sm:inline">Compare</span>
             <span className="sm:hidden">Run</span>
             <ArrowRight size={14} strokeWidth={3} />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;