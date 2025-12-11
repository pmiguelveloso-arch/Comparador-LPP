
import React from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { X, Layers, ArrowRight, Scale, Box, Ruler, Activity, Zap, ShoppingCart, Plus, HelpCircle } from 'lucide-react';

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare } = useApp();

  if (compareList.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] text-center">
        <div className="bg-zinc-900/80 p-12 rounded-2xl border border-dashed border-zinc-800 backdrop-blur-sm max-w-lg w-full shadow-2xl">
          <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <Layers size={32} className="text-zinc-600" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic mb-2">Matrix Empty</h2>
          <p className="text-zinc-500 font-mono text-xs mb-8 leading-relaxed uppercase tracking-wider">
            Select gear from the database to run side-by-side technical analysis.
          </p>
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 bg-white text-padel-black px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-zinc-200 transition shadow-lg hover:scale-105 transform duration-200"
          >
            Access Database <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </div>
      </div>
    );
  }

  const specs = [
    { label: 'Brand', key: 'brand', icon: null },
    { label: 'Year', key: 'year', icon: null },
    { label: 'Shape Geometry', key: 'shape', icon: Box },
    { label: 'Balance', key: 'balance', icon: Scale },
    { label: 'Core Material', key: 'core_type', icon: Layers },
    { label: 'Surface Material', key: 'surface_type', icon: Layers },
    { label: 'Weight Range', key: 'weight_text', icon: Ruler },
  ];

  const stats = [
    { label: 'Power Output', path: 'characteristics.power' },
    { label: 'Control', path: 'characteristics.control' },
    { label: 'Comfort', path: 'characteristics.comfort' },
    { label: 'Maneuverability', path: 'characteristics.maneuverability' },
    { label: 'Sweetspot', path: 'characteristics.sweetspot' },
    { label: 'Rigidity', path: 'characteristics.rigidity' },
  ];

  // Fixed 3 slots for comparison to maintain grid structure
  const slots = [0, 1, 2];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-px w-8 bg-padel-lime"></div>
                   <span className="text-xs font-mono text-padel-lime uppercase tracking-widest">Gear Lab</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
                  Technical <span className="text-zinc-700">Comparison</span>
                </h1>
             </div>
             <div className="flex items-center gap-4">
                <div className="text-zinc-500 font-mono text-xs hidden sm:block">
                   // {compareList.length} / 3 SLOTS ACTIVE
                </div>
                <button 
                  onClick={clearCompare}
                  className="text-xs font-bold text-red-500 hover:text-red-400 uppercase tracking-wider border border-red-500/30 px-3 py-1 rounded bg-red-500/10 transition-colors"
                >
                  Clear Matrix
                </button>
             </div>
        </div>
        
        {/* Comparison Table Container */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative">
          <div className="overflow-x-auto custom-scrollbar">
            {/* 
              GRID STRUCTURE: 
              - 1st Col: 220px (Labels) - Sticky
              - 2nd, 3rd, 4th Cols: minmax(280px, 1fr) (Data)
            */}
            <div className="grid grid-cols-[220px_repeat(3,minmax(280px,1fr))] min-w-[1060px]">
              
              {/* --- 1. MODEL HEADER ROW --- */}
              <div className="sticky left-0 z-20 p-6 border-b border-r border-zinc-800 bg-zinc-950 flex flex-col justify-end shadow-[4px_0_20px_rgba(0,0,0,0.5)]">
                  <Layers size={24} className="text-zinc-700 mb-2" />
                  <span className="text-[10px] font-mono text-padel-lime uppercase tracking-widest mb-1">Config Matrix</span>
                  <div className="text-xl font-black text-white italic uppercase">VS Mode</div>
              </div>

              {slots.map(i => {
                const r = compareList[i];
                return (
                  <div key={i} className="relative p-6 border-b border-r border-zinc-800 bg-zinc-900/50 flex flex-col items-center group hover:bg-zinc-800/50 transition-colors">
                    {r ? (
                      <>
                        <button 
                          onClick={() => removeFromCompare(r.id)}
                          className="absolute top-3 right-3 p-1.5 bg-zinc-950 text-zinc-600 rounded-lg border border-zinc-800 hover:border-red-500 hover:text-red-500 transition-colors z-20 opacity-0 group-hover:opacity-100"
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                        
                        <div className="relative w-full h-48 mb-6 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#27272a_0%,_transparent_70%)] opacity-0 group-hover:opacity-40 transition-opacity"></div>
                            <Link to={`/racket/${r.id}`}>
                                <img 
                                  src={r.image_url} 
                                  alt={r.model} 
                                  className="h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-10 transform group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-300" 
                                />
                            </Link>
                        </div>
                        
                        <div className="text-center w-full">
                            <div className="bg-padel-lime/10 text-padel-lime text-[10px] font-black px-2 py-1 rounded inline-block mb-2 uppercase tracking-wide border border-padel-lime/20">
                                {r.brand}
                            </div>
                            <Link to={`/racket/${r.id}`} className="block hover:text-padel-lime transition-colors">
                                <h3 className="font-black text-white text-lg md:text-xl leading-tight uppercase italic mb-1">{r.model}</h3>
                            </Link>
                            <div className="text-[10px] text-zinc-500 font-mono font-bold">{r.year} SERIES</div>
                        </div>
                      </>
                    ) : (
                      <Link to="/explore" className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl p-8 hover:border-padel-lime/50 hover:bg-zinc-800/50 transition-all cursor-pointer opacity-60 hover:opacity-100">
                           <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center mb-3 border border-zinc-800 group-hover:border-padel-lime transition-colors">
                               <Plus size={20} className="text-zinc-600 group-hover:text-padel-lime" />
                           </div>
                           <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white">Add Model</span>
                      </Link>
                    )}
                  </div>
                );
              })}


              {/* --- 2. SPEC ROWS --- */}
              {specs.map(spec => (
                <React.Fragment key={spec.key}>
                  <div className="sticky left-0 z-10 p-4 border-b border-r border-zinc-800 bg-zinc-950 flex items-center gap-3 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                    {spec.icon ? <spec.icon size={14} className="text-padel-lime" /> : <div className="w-3.5" />}
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">{spec.label}</span>
                  </div>
                  
                  {slots.map(i => {
                    const r = compareList[i];
                    return (
                      <div key={`${spec.key}-${i}`} className="p-4 border-b border-r border-zinc-800 bg-zinc-900/20 text-center flex items-center justify-center hover:bg-zinc-800/40 transition-colors">
                        {r ? (
                           <span className="text-sm font-bold text-zinc-200 uppercase tracking-wide">
                              {spec.key === 'weight_text' ? `${r.weight_min}-${r.weight_max}g` : (r as any)[spec.key]}
                           </span>
                        ) : (
                           <span className="text-zinc-800 font-black text-xl select-none">--</span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}


              {/* --- 3. PERFORMANCE STATS DIVIDER --- */}
              <div className="col-span-full p-3 bg-zinc-950 border-y border-zinc-800 flex items-center justify-center gap-3 sticky left-0 z-30">
                  <div className="h-px w-12 bg-zinc-800"></div>
                  <Zap size={14} className="text-padel-lime animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Performance Metrics</span>
                  <div className="h-px w-12 bg-zinc-800"></div>
              </div>


              {/* --- 4. STAT ROWS --- */}
              {stats.map(stat => (
                <React.Fragment key={stat.label}>
                   <div className="sticky left-0 z-10 p-4 border-b border-r border-zinc-800 bg-zinc-950 flex items-center justify-between shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">{stat.label}</span>
                  </div>
                  
                  {slots.map(i => {
                    const r = compareList[i];
                    if (!r) {
                        return (
                            <div key={`${stat.label}-${i}`} className="p-4 border-b border-r border-zinc-800 bg-zinc-900/20 text-center flex items-center justify-center">
                                <span className="text-zinc-800 font-black text-xl select-none">--</span>
                            </div>
                        )
                    }

                    const val = (r.characteristics as any)[stat.path.split('.')[1]];
                    return (
                      <div key={`${r.id}-${stat.label}`} className="p-4 border-b border-r border-zinc-800 bg-zinc-900/20 hover:bg-zinc-800/40 transition-colors">
                         <div className="flex items-center justify-between mb-2">
                           <span className="text-[9px] font-bold text-zinc-600">RATING</span>
                           <span className="text-xs font-bold text-white font-mono">{val}/10</span>
                         </div>
                         <div className="h-2 bg-zinc-950 rounded-sm overflow-hidden border border-zinc-800">
                           <div className="h-full bg-padel-lime shadow-[0_0_10px_rgba(163,230,53,0.4)] relative" style={{ width: `${val * 10}%` }}>
                              <div className="absolute right-0 top-0 bottom-0 w-px bg-white/40"></div>
                           </div>
                         </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}


              {/* --- 5. PRICE ROW --- */}
              <div className="sticky left-0 z-10 p-5 border-r border-zinc-800 bg-zinc-950 flex items-center gap-3 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                <ShoppingCart size={16} className="text-zinc-400" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Market Price</span>
              </div>
              
              {slots.map(i => {
                 const r = compareList[i];
                 return (
                    <div key={i} className="p-5 border-r border-zinc-800 bg-padel-lime/5 flex items-center justify-center">
                        {r ? (
                           <span className="text-lg font-black text-padel-lime font-mono tracking-tight bg-padel-lime/10 px-4 py-2 rounded-lg border border-padel-lime/20">
                              {r.price_range}
                           </span>
                        ) : (
                           <span className="text-zinc-800 font-black text-xl select-none">--</span>
                        )}
                    </div>
                 );
              })}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
