
import React, { useState, useMemo } from 'react';
import { RACKETS, BRANDS } from '../data/rackets';
import { Racket } from '../types';
import RacketCard from '../components/RacketCard';
import RacketCardFull from '../components/RacketCardFull';
import { Search, Filter, SlidersHorizontal, Grid } from 'lucide-react';
import { getRacketMatch } from '../utils/matchLogic';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedShape, setSelectedShape] = useState('Todas');
  const [selectedRacket, setSelectedRacket] = useState<Racket | null>(null);
  
  const filteredRackets = useMemo(() => {
    return RACKETS.filter(r => {
      const matchesSearch = r.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'Todas' || r.brand === selectedBrand;
      const matchesShape = selectedShape === 'Todas' || r.shape === selectedShape;
      
      return matchesSearch && matchesBrand && matchesShape;
    }).sort((a, b) => getRacketMatch(b) - getRacketMatch(a)); // Always sort by match score
  }, [searchTerm, selectedBrand, selectedShape]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-padel-black">
      {/* Quick View Modal */}
      {selectedRacket && (
        <RacketCardFull racket={selectedRacket} onClose={() => setSelectedRacket(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-zinc-800 pb-6">
            <div>
              <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Gear <span className="text-zinc-700">Lab</span></h1>
              <p className="text-zinc-500 font-mono text-xs mt-1">FULL EQUIPMENT DATABASE</p>
            </div>
            <div className="text-xs font-bold font-mono text-padel-lime bg-padel-lime/10 px-3 py-1 rounded border border-padel-lime/20">
              {filteredRackets.length} UNITS DETECTED
            </div>
        </div>
        
        {/* Filters Bar */}
        <div className="sticky top-20 z-30 bg-zinc-900/80 backdrop-blur-md p-4 rounded-xl border border-zinc-800 mb-8 shadow-2xl">
          <div className="grid md:grid-cols-12 gap-4">
            
            <div className="md:col-span-6 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-padel-lime transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="SEARCH DATABASE..." 
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-white placeholder-zinc-700 focus:border-padel-lime outline-none transition-all font-mono text-sm uppercase"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
                <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 appearance-none focus:border-padel-lime outline-none cursor-pointer text-xs font-bold uppercase tracking-wide"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="Todas">All Brands</option>
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <SlidersHorizontal className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                </div>
            </div>

            <div className="md:col-span-3">
                <div className="relative">
                    <select 
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded text-zinc-300 appearance-none focus:border-padel-lime outline-none cursor-pointer text-xs font-bold uppercase tracking-wide"
                      value={selectedShape}
                      onChange={(e) => setSelectedShape(e.target.value)}
                    >
                      <option value="Todas">All Shapes</option>
                      <option value="redonda">Redonda</option>
                      <option value="lágrima">Lágrima</option>
                      <option value="diamante">Diamante</option>
                      <option value="híbrida">Híbrida</option>
                    </select>
                    <Grid className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={14} />
                </div>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredRackets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRackets.map(racket => (
              <div key={racket.id} className="h-[420px]">
                <RacketCard 
                  racket={racket} 
                  onQuickView={setSelectedRacket}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
            <Filter size={48} className="text-zinc-800 mb-4" />
            <h3 className="text-xl font-bold text-white uppercase italic">No Data Found</h3>
            <p className="text-zinc-600 font-mono text-xs mt-2">Adjust search parameters to retrieve results.</p>
            <button 
                onClick={() => {setSearchTerm(''); setSelectedBrand('Todas'); setSelectedShape('Todas')}}
                className="mt-6 text-padel-lime text-xs font-bold uppercase tracking-widest hover:underline"
            >
                Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;