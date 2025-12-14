
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Upload, ScanLine, X, Search, Zap, Loader2, ArrowRight } from 'lucide-react';
import { identifyRacketFromImage } from '../utils/aiService';
import { RACKETS } from '../data/rackets';
import RacketCard from '../components/RacketCard';
import { Racket } from '../types';

const GearScanner = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [matchedRacket, setMatchedRacket] = useState<Racket | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setScanResult(null);
      setMatchedRacket(null);
      await performScan(file);
    }
  };

  const performScan = async (file: File) => {
    setIsScanning(true);
    try {
      const result = await identifyRacketFromImage(file);
      setScanResult(result);
      
      // Attempt to find in local DB
      if (result.brand && result.model) {
        const found = RACKETS.find(r => 
          r.brand.toLowerCase() === result.brand.toLowerCase() && 
          r.model.toLowerCase().includes(result.model.toLowerCase().split(' ')[0]) // Loose match on first word of model
        );
        setMatchedRacket(found || null);
      }
    } catch (error) {
      console.error("Scan error", error);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setScanResult(null);
    setMatchedRacket(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-padel-lime text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
             <ScanLine size={14} /> Motor de Visão IA
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
            Scanner de <span className="text-zinc-600">Equipamento</span>
          </h1>
          <p className="text-zinc-400 font-mono text-xs max-w-md mx-auto leading-relaxed">
            Carrega uma foto de qualquer raquete de padel. O nosso Motor Neural irá identificar o modelo, analisar a geometria e verificar especificações na nossa base de dados.
          </p>
        </div>

        {/* Main Scanner Area */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col">
          
          {!selectedImage ? (
            <div className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800 m-4 rounded-2xl hover:border-padel-lime/30 hover:bg-zinc-800/50 transition-all cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
              />
              <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mb-6 shadow-xl group">
                <Camera size={32} className="text-zinc-500 group-hover:text-padel-lime transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase italic mb-2">Carregar Foto da Raquete</h3>
              <p className="text-zinc-500 text-xs font-mono">JPG, PNG suportados</p>
            </div>
          ) : (
            <div className="flex-grow flex flex-col md:flex-row h-full">
              {/* Image Preview */}
              <div className="w-full md:w-1/2 bg-zinc-950 relative">
                 <img src={selectedImage} alt="Scan Target" className="w-full h-full object-contain p-6" />
                 <button 
                   onClick={resetScanner}
                   className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 hover:text-white transition-colors backdrop-blur-sm"
                 >
                   <X size={16} />
                 </button>
                 
                 {/* Scanning Overlay */}
                 {isScanning && (
                   <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                      <ScanLine size={48} className="text-padel-lime animate-pulse mb-4" />
                      <div className="text-padel-lime font-mono text-xs uppercase tracking-widest animate-pulse">A Analisar Geometria...</div>
                   </div>
                 )}
              </div>

              {/* Results Panel */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col border-l border-zinc-800">
                {isScanning ? (
                   <div className="flex-grow flex items-center justify-center text-zinc-600 font-mono text-xs">
                     <Loader2 size={24} className="animate-spin mr-2" /> A Processar...
                   </div>
                ) : scanResult ? (
                   <div className="animate-fade-in-up">
                      <div className="flex items-center gap-2 mb-6">
                         <div className={`w-3 h-3 rounded-full ${scanResult.confidence > 80 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                         <span className="text-xs font-bold text-white uppercase tracking-wide">
                            Identificação {scanResult.confidence > 80 ? 'Fiável' : 'Incerta'} ({scanResult.confidence}%)
                         </span>
                      </div>

                      <div className="space-y-6">
                          <div>
                             <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Marca Detetada</div>
                             <div className="text-2xl font-black text-white uppercase italic">{scanResult.brand}</div>
                          </div>
                          <div>
                             <div className="text-[10px] text-zinc-500 font-mono uppercase mb-1">Modelo Detetado</div>
                             <div className="text-xl font-bold text-padel-lime uppercase">{scanResult.model}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                                <div className="text-[9px] text-zinc-500 font-mono uppercase">Ano Est.</div>
                                <div className="text-white font-bold">{scanResult.year}</div>
                             </div>
                             <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                                <div className="text-[9px] text-zinc-500 font-mono uppercase">Formato</div>
                                <div className="text-white font-bold">{scanResult.shape}</div>
                             </div>
                          </div>

                          <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-800 text-xs text-zinc-400 leading-relaxed font-mono">
                             "{scanResult.analysis}"
                          </div>

                          {matchedRacket ? (
                             <div className="mt-4 pt-4 border-t border-zinc-800">
                                <div className="text-[10px] text-padel-lime font-mono uppercase mb-2 flex items-center gap-2">
                                   <Zap size={12} /> Correspondência na BD Encontrada
                                </div>
                                <div className="h-[200px]">
                                  <RacketCard racket={matchedRacket} showMatchScore={false} />
                                </div>
                             </div>
                          ) : (
                             <div className="mt-4 pt-4 border-t border-zinc-800 text-center">
                                <div className="text-zinc-500 text-xs italic mb-2">Modelo exato não encontrado na BD local.</div>
                                <Link to="/explore" className="text-padel-lime text-xs font-bold uppercase hover:underline flex items-center justify-center gap-1">
                                   Pesquisar Manualmente <ArrowRight size={12} />
                                </Link>
                             </div>
                          )}
                      </div>
                   </div>
                ) : (
                   <div className="flex-grow flex items-center justify-center text-zinc-600 font-mono text-xs text-center opacity-50">
                      Carrega uma imagem para extrair especificações técnicas.
                   </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GearScanner;
