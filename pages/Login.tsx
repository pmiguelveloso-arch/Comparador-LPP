
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Loader2, Database } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePostLogin = (user: any) => {
      if (!user.savedProfile && !localStorage.getItem('player_profile')) {
          navigate('/quiz');
      } else {
          navigate('/profile');
      }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      handlePostLogin(user);
    } catch (err: any) {
      setError(err?.toString() || 'Erro na ligação ao servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {isLoading && (
          <div className="absolute inset-0 bg-padel-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
             <div className="relative">
                <Loader2 size={40} className="text-padel-lime animate-spin" />
                <Database size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
             </div>
             <p className="text-white font-black uppercase italic text-xs mt-4 tracking-widest">A ligar à Base de Dados...</p>
          </div>
        )}

        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-800 mb-4 text-padel-lime">
                <Activity size={24} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Entrar na Conta</h1>
            <p className="text-zinc-500 text-xs font-mono mt-2 tracking-widest uppercase">Acesso Seguro via Cloud</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase mb-6 animate-shake">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">Email</label>
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-padel-lime transition-colors" size={16} />
                    <input 
                        type="email" 
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3.5 pl-10 pr-4 text-white text-sm focus:border-padel-lime outline-none transition-all placeholder-zinc-800 font-bold"
                        placeholder="exemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Password</label>
                   <button type="button" className="text-[9px] font-black text-padel-lime uppercase hover:underline">Esqueci-me</button>
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-padel-lime transition-colors" size={16} />
                    <input 
                        type="password" 
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3.5 pl-10 pr-4 text-white text-sm focus:border-padel-lime outline-none transition-all placeholder-zinc-800"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-padel-lime hover:bg-lime-400 text-padel-black font-black uppercase py-4 rounded-xl tracking-widest transition-all flex items-center justify-center gap-3 mt-4 shadow-[0_0_30px_rgba(163,230,53,0.2)] hover:scale-[1.02] active:scale-[0.98]"
            >
                Entrar no Lab <ArrowRight size={18} strokeWidth={3} />
            </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-800/50 pt-8">
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Ainda não tens conta?</p>
            <Link to="/register" className="text-white text-xs font-black uppercase hover:text-padel-lime transition-colors mt-2 inline-block">
                Criar Perfil de Atleta
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
