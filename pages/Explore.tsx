
import React, { useState, useMemo } from 'react';
import { RACKETS, BRANDS } from '../data/rackets';
import { Racket } from '../types';
import RacketCard from '../components/RacketCard';
import RacketCardFull from '../components/RacketCardFull';
import { Search, Filter, SlidersHorizontal, Scale, Box, Zap, Weight, ChevronDown, X, ChevronUp } from 'lucide-react';
import { getRacketMatch } from '../utils/matchLogic';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedShape, setSelectedShape] = useState('Todas');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Todas');
  const [selectedBalance, setSelectedBalance] = useState('Todas');
  const [selectedWeight, setSelectedWeight] = useState('Todas');
  const [selectedRigidity, setSelectedRigidity] = useState('Todas');
  
  const [selectedRacket, setSelectedRacket] = useState<Racket | null>(null);
  const [showFilters, setShowFilters] = useState(false); // Agora começa oculto
  
  const filteredRackets = useMemo(() => {
    return RACKETS.filter(r => {
      const matchesSearch = r.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrand === 'Todas' || r.brand === selectedBrand;
      const matchesShape = selectedShape === 'Todas' || r.shape === selectedShape;
      const matchesBalance = selectedBalance === 'Todas' || r.balance === selectedBalance;
      
      // Weight Filter
      let matchesWeight = true;
      if (selectedWeight !== 'Todas') {
        const avgWeight = (r.weight_min + r.weight_max) / 2;
        if (selectedWeight === 'light') matchesWeight = avgWeight < 360;
        else if (selectedWeight === 'mid') matchesWeight = avgWeight >= 360 && avgWeight <= 370;
        else if (selectedWeight === 'heavy') matchesWeight = avgWeight > 370;
      }

      // Rigidity (Dureza) Filter
      let matchesRigidity = true;
      if (selectedRigidity !== 'Todas') {
        const rig = r.characteristics.rigidity;
        if (selectedRigidity === 'soft') matchesRigidity = rig <= 5;
        else if (selectedRigidity === 'medium') matchesRigidity = rig > 5 && rig <= 7;
        else if (selectedRigidity === 'hard') matchesRigidity = rig > 7;
      }
      
      // Price Filter
      let matchesPrice = true;
      if (selectedPriceRange !== 'Todas') {
        const cleanPrice = (r.price_range || "").replace(/[^\d-]/g, '');
        const priceParts = cleanPrice.split('-').map(p => parseInt(p, 10));
        const avgPrice = priceParts.length === 2 
          ? (priceParts[0] + priceParts[1]) / 2 
          : priceParts[0] || 0;

        if (selectedPriceRange === 'economy') matchesPrice = avgPrice < 160;
        else if (selectedPriceRange === 'mid') matchesPrice = avgPrice >= 160 && avgPrice <= 260;
        else if (selectedPriceRange === 'premium') matchesPrice = avgPrice > 260;
      }
      
      return matchesSearch && matchesBrand && matchesShape && matchesPrice && matchesBalance && matchesWeight && matchesRigidity;
    }).sort((a, b) => {
        const scoreA = getRacketMatch(a);
        const scoreB = getRacketMatch(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return a.model.localeCompare(b.model);
    });
  }, [searchTerm, selectedBrand, selectedShape, selectedPriceRange, selectedBalance, selectedWeight, selectedRigidity]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBrand('Todas');
    setSelectedShape('Todas');
    setSelectedPriceRange('Todas');
    setSelectedBalance('Todas');
    setSelectedWeight('Todas');
    setSelectedRigidity('Todas');
  };

  const hasActiveFilters = selectedBrand !== 'Todas' || selectedShape !== 'Todas' || selectedPriceRange !== 'Todas' || selectedBalance !== 'Todas' || selectedWeight !== 'Todas' || selectedRigidity !== 'Todas';

  const FilterSelect = ({ label, icon: Icon, value, onChange, options }: any) => (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest px-1">
        <Icon size={10} /> {label}
      </label>
      <div className="relative group">
        <select 
          className="w-full appearance-none px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 outline-none focus:border-padel-lime focus:text-white text-[11px] font-bold uppercase cursor-pointer transition-all pr-8"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt: any) => (
            <option key={opt.val} value={opt.val}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none group-hover:text-zinc-400" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      {selectedRacket && (
        <RacketCardFull racket={selectedRacket} onClose={() => setSelectedRacket(null)} />
      )}

      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-8 bg-padel-lime"></div>
                <span className="text-xs font-mono text-padel-lime uppercase tracking-widest">Base de Dados de Performance</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Explorar <span className="text-zinc-700">Catálogo</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
               {hasActiveFilters && (
                 <button onClick={clearFilters} className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1 border-b border-zinc-800 pb-0.5">
                   <X size={12} /> Limpar
                 </button>
               )}
               <div className="text-[10px] font-bold font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-zinc-800 uppercase tracking-wider">
                  {filteredRackets.length} Resultados
               </div>
            </div>
        </div>

        {/* Search and Filter Toggle Area */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
           <div className="relative flex-grow group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-600 group-focus-within:text-padel-lime transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar por marca ou modelo..." 
                className="w-full pl-12 pr-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white outline-none focus:border-padel-lime transition-all text-xs uppercase font-bold tracking-widest placeholder-zinc-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center justify-center gap-3 px-8 py-4 rounded-xl border font-black uppercase text-xs tracking-widest transition-all duration-300 ${
               showFilters || hasActiveFilters 
                ? 'bg-padel-lime text-padel-black border-padel-lime shadow-[0_0_20px_rgba(163,230,53,0.2)]' 
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
             }`}
           >
             <SlidersHorizontal size={18} />
             {showFilters ? 'Fechar Filtros' : 'Filtrar por Caraterísticas'}
             {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
           </button>
        </div>
        
        {/* Advanced Filter Panel - Conditionally rendered with animation */}
        {showFilters && (
          <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-2xl border border-zinc-800 mb-8 shadow-2xl animate-fade-in-up">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <FilterSelect 
                label="Marca" 
                icon={Box} 
                value={selectedBrand} 
                onChange={setSelectedBrand}
                options={[{ val: 'Todas', label: 'Todas as Marcas' }, ...BRANDS.map(b => ({ val: b, label: b }))]}
              />
              
              <FilterSelect 
                label="Formato" 
                icon={Box} 
                value={selectedShape} 
                onChange={setSelectedShape}
                options={[
                  { val: 'Todas', label: 'Qualquer' },
                  { val: 'redonda', label: 'Redonda' },
                  { val: 'lágrima', label: 'Lágrima' },
                  { val: 'diamante', label: 'Diamante' },
                  { val: 'híbrida', label: 'Híbrida' }
                ]}
              />

              <FilterSelect 
                label="Peso" 
                icon={Weight} 
                value={selectedWeight} 
                onChange={setSelectedWeight}
                options={[
                  { val: 'Todas', label: 'Todos' },
                  { val: 'light', label: 'Leve (<360g)' },
                  { val: 'mid', label: 'Standard (360-370g)' },
                  { val: 'heavy', label: 'Pesada (>370g)' }
                ]}
              />

              <FilterSelect 
                label="Equilíbrio" 
                icon={Scale} 
                value={selectedBalance} 
                onChange={setSelectedBalance}
                options={[
                  { val: 'Todas', label: 'Qualquer' },
                  { val: 'baixo', label: 'Baixo (Controlo)' },
                  { val: 'médio', label: 'Médio (Híbrido)' },
                  { val: 'alto', label: 'Alto (Potência)' }
                ]}
              />

              <FilterSelect 
                label="Dureza" 
                icon={Zap} 
                value={selectedRigidity} 
                onChange={setSelectedRigidity}
                options={[
                  { val: 'Todas', label: 'Todas' },
                  { val: 'soft', label: 'Macia (Saída)' },
                  { val: 'medium', label: 'Média (Polivalente)' },
                  { val: 'hard', label: 'Dura (Potência)' }
                ]}
              />

              <FilterSelect 
                label="Preço" 
                icon={Search} 
                value={selectedPriceRange} 
                onChange={setSelectedPriceRange}
                options={[
                  { val: 'Todas', label: 'Qualquer' },
                  { val: 'economy', label: 'Económico (<160€)' },
                  { val: 'mid', label: 'Performance (160-260€)' },
                  { val: 'premium', label: 'Premium (>260€)' }
                ]}
              />
            </div>
          </div>
        )}

        {filteredRackets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRackets.map(racket => (
              <div key={racket.id} className="h-[430px]">
                <RacketCard 
                  racket={racket} 
                  onQuickView={setSelectedRacket}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800 text-center">
            <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-6 text-zinc-800">
               <Filter size={32} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase italic tracking-tight">Sem resultados</h3>
            <p className="text-zinc-500 text-xs mt-2 max-w-xs mx-auto">Tenta ajustar os filtros ou pesquisar por outro termo.</p>
            <button onClick={clearFilters} className="mt-8 bg-white text-black px-6 py-2 rounded font-black text-[10px] uppercase hover:bg-padel-lime transition-colors">Limpar Filtros</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
