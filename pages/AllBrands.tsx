
import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_META } from '../data/brands';
import { ArrowRight, Award } from 'lucide-react';

const AllBrands = () => {
  const brands = Object.keys(BRAND_META);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">
              Fabricantes de <span className="text-padel-lime">Elite</span>
            </h1>
            <p className="text-zinc-400 font-mono text-xs md:text-sm max-w-2xl leading-relaxed">
              Explore o catálogo completo das marcas mais prestigiadas do circuito mundial. Selecione um fabricante para ver toda a gama de raquetes, tecnologias e especificações técnicas.
            </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const meta = BRAND_META[brand];
            return (
              <Link 
                key={brand} 
                to={`/brands/${brand}`}
                className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-padel-lime transition-all duration-300 flex flex-col h-[300px]"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                   <img 
                     src={meta.cover} 
                     alt={brand} 
                     className="w-full h-full object-cover opacity-30 group-hover:opacity-20 group-hover:scale-105 transition-all duration-700" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 flex flex-col h-full">
                   
                   {/* Logo / Title */}
                   <div className="mb-auto">
                      <div className="inline-block px-3 py-1 bg-padel-lime/10 text-padel-lime text-[10px] font-bold uppercase tracking-widest rounded border border-padel-lime/20 mb-3">
                        Oficial Partner
                      </div>
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-tight group-hover:text-padel-lime transition-colors">
                        {brand}
                      </h2>
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider mt-1">
                        // {meta.slogan}
                      </p>
                   </div>

                   {/* Description */}
                   <div className="mt-4">
                      <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-6">
                        {meta.desc}
                      </p>
                      
                      <div className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wide group-hover:gap-4 transition-all">
                         Ver Coleção <ArrowRight size={14} className="text-padel-lime" />
                      </div>
                   </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default AllBrands;
