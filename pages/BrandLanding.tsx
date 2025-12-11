import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RACKETS } from '../data/rackets';
import RacketCard from '../components/RacketCard';
import RacketCardFull from '../components/RacketCardFull';
import { Racket } from '../types';
import { ArrowLeft, Target, Award, Zap, BarChart2 } from 'lucide-react';
import { getRacketMatch } from '../utils/matchLogic';

// Mock Data for Brand Metadata
const BRAND_META: Record<string, { desc: string; cover: string; slogan: string }> = {
  Bullpadel: {
    slogan: "The Padel Specialist",
    desc: "Leading the industry with innovation and design. Bullpadel is the choice of champions like Paquito Navarro and Juan Tello, offering maximum power and precision engineering.",
    cover: "https://images.unsplash.com/photo-1626244422184-e8674d852a41?q=80&w=2000&auto=format&fit=crop"
  },
  Nox: {
    slogan: "Makes You Improve",
    desc: "Engineered for performance. Home of Agustín Tapia, Nox rackets are renowned for their incredible sweet spot and anti-vibration technology tailored for every level.",
    cover: "https://images.unsplash.com/photo-1599474924187-334a405be634?q=80&w=2000&auto=format&fit=crop"
  },
  Adidas: {
    slogan: "All For Padel",
    desc: "German engineering meets padel court dominance. Featuring the Metalbone and Adipower series, Adidas delivers customizable weight systems and explosive power.",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop"
  },
  Head: {
    slogan: "Performance for Every Player",
    desc: "Advanced Auxetic technology for sensational feel. Head dominates the tour with Arturo Coello and Ari Sánchez, focusing on speed and control.",
    cover: "https://images.unsplash.com/photo-1628779238951-be2c9f2a07f4?q=80&w=2000&auto=format&fit=crop"
  },
  Kuikma: {
    slogan: "Precision & Value",
    desc: "Developed by Decathlon's dedicated padel center in Madrid. High-performance materials at an unbeatable price point, tested by Horacio Álvarez Clementi.",
    cover: "https://images.unsplash.com/photo-1610342517865-c323f46f3325?q=80&w=2000&auto=format&fit=crop"
  },
  StarVie: {
    slogan: "Made in Spain",
    desc: "Handcrafted excellence. One of the few brands manufacturing directly in Spain, ensuring premium quality control and unique material compositions.",
    cover: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2000&auto=format&fit=crop"
  }
};

const DEFAULT_META = {
  slogan: "Professional Padel Gear",
  desc: "Explore our collection of high-performance rackets designed for players who demand the best.",
  cover: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2000&auto=format&fit=crop"
};

const BrandLanding = () => {
  const { brandName } = useParams();
  const [selectedRacket, setSelectedRacket] = useState<Racket | null>(null);
  
  // Normalize brand name for case-insensitive matching
  const normalizedBrand = brandName ? brandName.charAt(0).toUpperCase() + brandName.slice(1).toLowerCase() : '';
  const meta = BRAND_META[normalizedBrand] || DEFAULT_META;

  // Memoize filtered and sorted rackets
  const brandRackets = useMemo(() => {
    const filtered = RACKETS.filter(r => r.brand.toLowerCase() === brandName?.toLowerCase());
    // Sort by Match Score if profile exists
    return filtered.sort((a, b) => getRacketMatch(b) - getRacketMatch(a));
  }, [brandName]);

  // Calculate stats
  const avgPower = Math.round(brandRackets.reduce((acc, r) => acc + r.characteristics.power, 0) / brandRackets.length) || 0;
  const avgControl = Math.round(brandRackets.reduce((acc, r) => acc + r.characteristics.control, 0) / brandRackets.length) || 0;

  if (!brandName) return null;

  return (
    <div className="min-h-screen bg-padel-black pt-20">
      {/* Modal View */}
      {selectedRacket && (
        <RacketCardFull racket={selectedRacket} onClose={() => setSelectedRacket(null)} />
      )}

      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-padel-black via-padel-black/60 to-transparent z-10"></div>
        <img src={meta.cover} alt={brandName} className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="absolute bottom-0 left-0 w-full z-20 px-4 sm:px-6 lg:px-8 pb-10">
          <div className="max-w-7xl mx-auto">
             <Link to="/explore" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 text-xs font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft size={14} /> Back to Catalog
             </Link>
             <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-2">
               {normalizedBrand}
             </h1>
             <p className="text-padel-lime font-mono text-sm md:text-base uppercase tracking-widest font-bold mb-4">
               // {meta.slogan}
             </p>
             <p className="text-zinc-300 max-w-2xl text-sm md:text-lg leading-relaxed border-l-2 border-padel-lime pl-4">
               {meta.desc}
             </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/5 bg-zinc-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-zinc-800 rounded text-padel-lime"><BarChart2 size={20} /></div>
               <div>
                 <div className="text-xl font-bold text-white font-mono">{brandRackets.length}</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Models Indexed</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-zinc-800 rounded text-violet-500"><Zap size={20} /></div>
               <div>
                 <div className="text-xl font-bold text-white font-mono">{avgPower}/10</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Avg. Power</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-zinc-800 rounded text-blue-500"><Target size={20} /></div>
               <div>
                 <div className="text-xl font-bold text-white font-mono">{avgControl}/10</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Avg. Control</div>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-zinc-800 rounded text-amber-500"><Award size={20} /></div>
               <div>
                 <div className="text-xl font-bold text-white font-mono">Pro</div>
                 <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Series Tier</div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-black text-white uppercase italic flex items-center gap-2">
                <span className="w-2 h-6 bg-padel-lime skew-x-[-12deg] block"></span>
                Available Models
            </h2>
            <div className="text-[10px] font-mono text-zinc-500 uppercase">
                Sorted by Match Relevance
            </div>
         </div>

         {brandRackets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {brandRackets.map(racket => (
                <div key={racket.id} className="h-[420px]">
                  <RacketCard 
                    racket={racket} 
                    onQuickView={(r) => setSelectedRacket(r)} 
                  />
                </div>
              ))}
            </div>
         ) : (
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
               <p className="text-zinc-500">No rackets found for this brand in the database.</p>
               <Link to="/explore" className="text-padel-lime text-sm font-bold mt-4 inline-block hover:underline">
                 View all brands
               </Link>
            </div>
         )}
      </div>
    </div>
  );
};

export default BrandLanding;