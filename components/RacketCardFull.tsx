
import React from 'react';
import { Racket } from '../types';
import { X, Activity, Box, Scale, Ruler, Layers, Check, ShoppingCart, ExternalLink, Zap } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useApp } from '../context/AppContext';
import { getRacketMatch } from '../utils/matchLogic';

interface RacketCardFullProps {
  racket: Racket;
  onClose: () => void;
}

const RacketCardFull: React.FC<RacketCardFullProps> = ({ racket, onClose }) => {
  const { addToCompare, isInCompare } = useApp();
  const matchScore = getRacketMatch(racket);
  const isCompared = isInCompare(racket.id);

  const chartData = [
    { subject: 'Power', A: racket.characteristics.power, fullMark: 10 },
    { subject: 'Control', A: racket.characteristics.control, fullMark: 10 },
    { subject: 'Comfort', A: racket.characteristics.comfort, fullMark: 10 },
    { subject: 'Maneuver.', A: racket.characteristics.maneuverability, fullMark: 10 },
    { subject: 'Sweetspot', A: racket.characteristics.sweetspot, fullMark: 10 },
    { subject: 'Rigidity', A: racket.characteristics.rigidity, fullMark: 10 },
  ];

  // Helper for Spec Item
  const SpecItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | number }) => (
    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
      <div className="p-2 bg-zinc-950 rounded text-zinc-500">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">{label}</div>
        <div className="text-white font-bold text-xs uppercase">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-padel-black border border-zinc-700 rounded-3xl shadow-2xl animate-fade-in-up scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
        
        {/* Close Button */}
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-zinc-800 text-white rounded-full hover:bg-padel-lime hover:text-padel-black transition-colors"
        >
            <X size={20} />
        </button>

        <div className="grid lg:grid-cols-12 min-h-[600px]">
          
          {/* Left Column: Visuals */}
          <div className="lg:col-span-5 bg-zinc-900/50 p-8 flex flex-col gap-6 border-b lg:border-b-0 lg:border-r border-zinc-800">
            
            {/* Header Mobile Only */}
            <div className="lg:hidden mb-4">
                <div className="text-padel-lime text-xs font-bold uppercase tracking-widest mb-1">{racket.brand}</div>
                <h2 className="text-3xl font-black text-white italic uppercase">{racket.model}</h2>
            </div>

            {/* Image Area */}
            <div className="relative flex-grow flex items-center justify-center min-h-[300px]">
               {matchScore > 0 && (
                 <div className="absolute top-0 left-0">
                    <div className="bg-padel-black/90 backdrop-blur border border-padel-lime text-padel-lime px-3 py-1 rounded text-xs font-bold flex items-center gap-2 font-mono shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                      <Zap size={12} fill="currentColor" />
                      MATCH: {matchScore}%
                    </div>
                 </div>
               )}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#27272a_0%,_transparent_70%)] opacity-30"></div>
               <img 
                 src={racket.image_url} 
                 alt={racket.model} 
                 className="relative z-10 w-full max-h-[350px] object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]" 
               />
            </div>

            {/* Radar */}
            <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 h-[220px]">
               <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                 <Activity size={12} /> Matriz de Performance
               </h4>
               <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="45%" outerRadius="70%" data={chartData}>
                      <PolarGrid stroke="#3f3f46" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar
                        name={racket.model}
                        dataKey="A"
                        stroke="#a3e635"
                        strokeWidth={2}
                        fill="#a3e635"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Specs & Info */}
          <div className="lg:col-span-7 p-8 flex flex-col">
             
             {/* Desktop Header */}
             <div className="hidden lg:block mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-padel-black font-bold tracking-wider uppercase text-[10px] bg-padel-lime px-2 py-0.5 rounded">
                      {racket.brand}
                    </span>
                    <span className="text-zinc-500 text-[10px] font-mono font-bold border border-zinc-800 px-2 py-0.5 rounded">
                      {racket.year}
                    </span>
                </div>
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {racket.model}
                </h2>
             </div>

             <div className="p-4 bg-zinc-900 border-l-2 border-padel-lime rounded-r-lg mb-6">
                <p className="text-zinc-300 text-sm leading-relaxed">
                   {racket.review_summary}
                </p>
             </div>

             {/* Specs Grid */}
             <div className="grid grid-cols-2 gap-3 mb-6">
                  <SpecItem icon={Box} label="Formato" value={racket.shape} />
                  <SpecItem icon={Scale} label="Balanço" value={racket.balance} />
                  <SpecItem icon={Ruler} label="Peso" value={`${racket.weight_min}-${racket.weight_max}g`} />
                  <SpecItem icon={Layers} label="Núcleo" value={racket.core_type} />
             </div>

             <div className="grid md:grid-cols-2 gap-6 mb-8">
                 {/* Technologies */}
                 <div>
                    <h5 className="text-xs font-bold text-white uppercase mb-3 border-b border-zinc-800 pb-2">Tecnologias</h5>
                    <div className="space-y-2">
                        {racket.technologies.slice(0, 3).map((tech, i) => (
                           <div key={i} className="flex items-start gap-2">
                              <Check size={12} className="text-padel-lime mt-0.5 flex-shrink-0" />
                              <div>
                                 <div className="text-xs font-bold text-zinc-300 uppercase">{tech.label}</div>
                                 <div className="text-[9px] text-zinc-500 font-mono">{tech.note}</div>
                              </div>
                           </div>
                        ))}
                    </div>
                 </div>
                 
                 {/* Characteristics List */}
                 <div>
                    <h5 className="text-xs font-bold text-white uppercase mb-3 border-b border-zinc-800 pb-2">Características</h5>
                    <div className="space-y-3">
                       {['Power', 'Control', 'Comfort'].map((c, i) => {
                          const val = (racket.characteristics as any)[c.toLowerCase()];
                          return (
                            <div key={i}>
                               <div className="flex justify-between text-[9px] font-bold text-zinc-400 uppercase mb-1">
                                  <span>{c}</span>
                                  <span className="text-white font-mono">{val}/10</span>
                                </div>
                               <div className="h-1 bg-zinc-800 rounded-full">
                                  <div className="h-full bg-white" style={{ width: `${val * 10}%` }}></div>
                               </div>
                            </div>
                          )
                       })}
                    </div>
                 </div>
             </div>
             
             {/* Footer Actions */}
             <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 bg-zinc-900 rounded text-zinc-400">
                       <ShoppingCart size={18} />
                    </div>
                    <div>
                       <div className="text-[10px] text-zinc-500 font-mono uppercase">Preço Est.</div>
                       <div className="text-lg font-bold text-padel-lime font-mono">{racket.price_range}</div>
                    </div>
                 </div>

                 <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => !isCompared && addToCompare(racket)}
                        disabled={isCompared}
                        className={`flex-1 md:flex-none px-6 py-3 rounded text-xs font-bold uppercase tracking-widest border transition-all ${
                        isCompared 
                            ? 'border-zinc-700 text-zinc-500 cursor-default bg-zinc-900'
                            : 'border-zinc-700 text-white hover:border-padel-lime hover:text-padel-lime hover:bg-padel-lime/5'
                        }`}
                    >
                        {isCompared ? 'Adicionado' : 'Comparar'}
                    </button>
                    
                    <a 
                       href={racket.prices?.[0]?.url || '#'} 
                       target="_blank"
                       rel="noreferrer"
                       className="flex-1 md:flex-none bg-white text-padel-black px-6 py-3 rounded font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                    >
                        Comprar Agora <ExternalLink size={14} />
                    </a>
                 </div>
             </div>

             {/* Store Listing in Modal (Optional enhancement to match RacketDetail) */}
             <div className="mt-4 pt-4 border-t border-zinc-800">
                <h6 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Disponível Em</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {racket.prices.map((price, idx) => (
                    <a 
                      key={idx} 
                      href={price.url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-padel-lime hover:bg-zinc-800 transition-all group"
                    >
                       <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-white flex items-center justify-center text-black font-bold text-[10px] uppercase">
                             {price.store ? price.store.substring(0,2) : '??'}
                          </div>
                          <div className="font-bold text-zinc-300 text-xs uppercase">{price.store || 'Unknown'}</div>
                       </div>
                       <span className="text-sm font-bold text-padel-lime font-mono">{price.price}€</span>
                    </a>
                  ))}
                </div>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RacketCardFull;
