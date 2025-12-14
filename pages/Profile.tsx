
import React from 'react';
import { PlayerProfile } from '../types';
import { Link } from 'react-router-dom';
import { User, Activity, Edit2, Zap, Shield, Target, Wallet, HeartPulse, Scale, Gauge, Wind, AlertTriangle, Cpu, ArrowRight, MessageSquare, ExternalLink, Save } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { RACKETS } from '../data/rackets';

const Profile = () => {
  const { getUserReviews } = useApp();
  const { isAuthenticated, user } = useAuth();
  
  const savedProfile = localStorage.getItem('player_profile');
  const profile: PlayerProfile | null = savedProfile ? JSON.parse(savedProfile) : null;
  
  const userReviews = getUserReviews();

  if (!profile) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] text-center">
        <div className="bg-zinc-900/80 p-10 rounded-2xl border border-zinc-800 backdrop-blur-sm max-w-md w-full">
            <User size={64} className="mx-auto text-zinc-700 mb-6" />
            <h2 className="text-2xl font-black uppercase italic text-white mb-2">Perfil Não Encontrado</h2>
            <p className="text-zinc-500 font-mono text-xs mb-8">NENHUM DADO DE ATLETA DETETADO LOCALMENTE.</p>
            <Link to="/quiz" className="flex items-center justify-center gap-2 bg-padel-lime text-padel-black px-8 py-3 rounded font-bold uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_20px_rgba(163,230,53,0.3)] text-xs">
              Inicializar Perfil
            </Link>
        </div>
      </div>
    );
  }

  // Helper for Stats Bar
  const StatRow = ({ label, value, color = "bg-padel-lime" }: { label: string, value: number, color?: string }) => (
    <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-zinc-500">
            <span>{label}</span>
            <span className="text-white font-mono">{value}/10</span>
        </div>
        <div className="h-2 bg-zinc-950 rounded-sm overflow-hidden border border-zinc-800/50">
            <div className={`h-full ${color} relative`} style={{ width: `${value * 10}%` }}>
                <div className="absolute right-0 top-0 h-full w-[2px] bg-white/50"></div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-5xl mx-auto">
        
        {/* Guest Warning / CTA */}
        {!isAuthenticated && (
            <div className="bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
                        <Save size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold uppercase italic">Modo Convidado Ativo</h3>
                        <p className="text-zinc-400 text-xs font-mono max-w-md">Os teus dados de perfil estão guardados temporariamente no navegador. Cria uma conta para guardar os teus dados permanentemente e aceder de qualquer dispositivo.</p>
                    </div>
                </div>
                <Link to="/register" className="bg-white text-padel-black px-6 py-3 rounded-lg font-bold uppercase text-xs tracking-wide hover:bg-zinc-200 transition whitespace-nowrap">
                    Guardar Perfil
                </Link>
            </div>
        )}

        {/* Header / Identity Card */}
        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800 mb-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-padel-lime/5 to-transparent skew-x-[-20deg] translate-x-20 pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="relative">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-950 rounded-2xl border border-zinc-700 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            <User size={40} className="text-zinc-500" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-padel-lime text-padel-black text-[10px] font-black px-2 py-1 rounded border border-padel-black">
                            {isAuthenticated ? 'PRO' : 'GUEST'}
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                                Identidade do Jogador
                            </div>
                            {profile.style === 'ofensivo' && <Zap size={12} className="text-padel-lime" />}
                            {profile.style === 'consistente' && <Shield size={12} className="text-blue-400" />}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-1">
                            {isAuthenticated ? user?.name : (profile.name || 'Atleta Convidado')}
                        </h1>
                        <div className="flex items-center gap-2 justify-center md:justify-start text-xs font-mono">
                            <span className="text-white font-bold">{profile.experience} CLASSE</span>
                            <span className="text-zinc-600">|</span>
                            <span className="text-padel-lime">ARQUÉTIPO {profile.style}</span>
                        </div>
                    </div>
                </div>

                <Link to="/quiz" className="group flex items-center gap-2 bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 hover:border-padel-lime px-5 py-3 rounded-xl transition-all">
                    <Edit2 size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider group-hover:text-white">Atualizar Dados</span>
                </Link>
            </div>

            {/* Moved Biometrics Section */}
            <div className="mt-8 pt-6 border-t border-zinc-800 relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Scale size={14} className="text-zinc-500" />
                    <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Biometria</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 flex flex-col items-center md:items-start">
                        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider mb-1">Idade</span>
                        <span className="text-lg font-bold text-white font-mono">{profile.age} <span className="text-xs text-zinc-600">Anos</span></span>
                    </div>
                    <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 flex flex-col items-center md:items-start">
                        <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider mb-1">Género</span>
                        <span className="text-lg font-bold text-white font-mono">{profile.gender}</span>
                    </div>
                    {profile.height && (
                        <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 flex flex-col items-center md:items-start">
                            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider mb-1">Altura</span>
                            <span className="text-lg font-bold text-white font-mono">{profile.height} <span className="text-xs text-zinc-600">cm</span></span>
                        </div>
                    )}
                    {profile.weight && (
                        <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50 flex flex-col items-center md:items-start">
                            <span className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider mb-1">Peso</span>
                            <span className="text-lg font-bold text-white font-mono">{profile.weight} <span className="text-xs text-zinc-600">kg</span></span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* AI Analysis Banner */}
        {profile.aiAnalysis && (
            <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-padel-lime/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black text-white uppercase italic mb-3 flex items-center gap-2">
                        <Cpu size={16} className="text-padel-lime" /> Análise do Treinador IA
                    </h3>
                    <p className="text-zinc-300 font-mono text-xs md:text-sm leading-relaxed border-l-2 border-padel-lime pl-4">
                        "{profile.aiAnalysis}"
                    </p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            
            {/* Left Column: Stats (4 cols) - Biometrics removed */}
            <div className="md:col-span-4 space-y-6">
                
                {/* Attribute Preferences */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-full">
                    <h3 className="text-sm font-black text-white uppercase italic mb-6 flex items-center gap-2">
                        <Activity size={16} className="text-padel-lime" /> Objetivos de Atributos
                    </h3>
                    <StatRow label="Potência" value={profile.power} color="bg-violet-500" />
                    <StatRow label="Controlo" value={profile.control} color="bg-padel-lime" />
                    <StatRow label="Conforto/Absorção" value={profile.comfort} color="bg-blue-500" />
                    <StatRow label="Rigidez Estrutural" value={profile.rigidity} color="bg-zinc-500" />
                </div>
            </div>

            {/* Right Column: Game Context & Meta (8 cols) */}
            <div className="md:col-span-8 space-y-6">
                
                {/* Game Context Card */}
                <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-full">
                    <h3 className="text-sm font-black text-white uppercase italic mb-6 flex items-center gap-2">
                        <Target size={16} className="text-padel-lime" /> Contexto de Jogo
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                            <div className="p-2 bg-zinc-900 rounded-lg text-padel-lime">
                                <Activity size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Posição no Campo</div>
                                <div className="text-white font-bold uppercase">{profile.position || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                            <div className="p-2 bg-zinc-900 rounded-lg text-violet-500">
                                <Gauge size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Frequência de Smash</div>
                                <div className="text-white font-bold uppercase">{profile.smash_frequency || 'N/A'}</div>
                            </div>
                        </div>

                         <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                            <div className="p-2 bg-zinc-900 rounded-lg text-blue-500">
                                <Wind size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Ambiente de Jogo</div>
                                <div className="text-white font-bold uppercase">{profile.court_type || 'N/A'}</div>
                            </div>
                        </div>

                        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
                            <div className="p-2 bg-zinc-900 rounded-lg text-amber-500">
                                <Wallet size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] text-zinc-500 font-mono uppercase">Orçamento</div>
                                <div className="text-white font-bold uppercase">{profile.budget}</div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Alert Card (Conditional) - Moved inside Context card for cleaner layout if needed, or keep separate */}
                    {profile.injuries && profile.injuries.some(i => i !== 'None') && (
                        <div className="mt-6 bg-red-500/5 rounded-xl p-4 border border-red-500/20">
                             <h3 className="text-xs font-black text-red-400 uppercase italic mb-3 flex items-center gap-2">
                                <AlertTriangle size={14} /> Considerações Médicas
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {profile.injuries.map(injury => (
                                    <span key={injury} className="px-3 py-1 bg-red-500/20 text-red-300 text-[10px] font-bold uppercase rounded border border-red-500/30 flex items-center gap-2">
                                        <HeartPulse size={10} /> {injury}
                                    </span>
                                ))}
                            </div>
                            <p className="text-zinc-400 text-[10px] font-mono mt-2">
                                * O sistema filtrou automaticamente equipamento de alta vibração e aplicou penalidades em equipamentos rígidos.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Scouting Reports (Reviews) */}
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 mb-8">
            <h3 className="text-sm font-black text-white uppercase italic mb-6 flex items-center gap-2">
               <MessageSquare size={16} className="text-zinc-500" /> Relatórios de Scouting
            </h3>

            {userReviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {userReviews.map((review) => {
                      const racket = RACKETS.find(r => r.id === review.racketId);
                      return (
                         <div key={review.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex gap-4">
                             {racket && (
                                <div className="w-16 h-20 bg-zinc-900 rounded-lg border border-zinc-800 flex-shrink-0 flex items-center justify-center p-1">
                                    <img src={racket.image_url} alt="racket" className="w-full h-full object-contain" />
                                </div>
                             )}
                             <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-bold text-white uppercase">{racket ? racket.model : 'Equipamento Desconhecido'}</span>
                                    <div className="flex items-center gap-1 bg-padel-lime/10 px-1.5 py-0.5 rounded border border-padel-lime/20">
                                       <Zap size={10} className="text-padel-lime fill-current" />
                                       <span className="text-[10px] font-bold text-padel-lime">{review.rating}/10</span>
                                    </div>
                                </div>
                                <p className="text-zinc-500 text-xs leading-tight line-clamp-2 mb-2 italic">"{review.comment}"</p>
                                <div className="flex justify-between items-center mt-auto">
                                   <span className="text-[9px] text-zinc-600 font-mono uppercase">{new Date(review.date).toLocaleDateString()}</span>
                                   {racket && (
                                     <Link to={`/racket/${racket.id}`} className="text-[10px] text-padel-lime font-bold uppercase hover:underline flex items-center gap-1">
                                        Ver Equipamento <ExternalLink size={8} />
                                     </Link>
                                   )}
                                </div>
                             </div>
                         </div>
                      );
                   })}
                </div>
            ) : (
                <div className="p-8 border border-dashed border-zinc-800 rounded-xl text-center bg-zinc-950/50">
                    <p className="text-zinc-500 text-xs mb-2">Ainda não submeteste análises de equipamento.</p>
                    <Link to="/explore" className="text-padel-lime font-bold text-xs uppercase hover:underline">Avaliar equipamento agora</Link>
                </div>
            )}
        </div>

        {/* Footer Action */}
        <div className="mt-8 flex justify-center">
            <Link to="/match" className="flex items-center gap-3 bg-padel-lime text-padel-black px-10 py-4 rounded-xl font-black uppercase tracking-wide hover:bg-lime-300 transition shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                Ver Recomendações <ArrowRight size={20} strokeWidth={3} />
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Profile;
