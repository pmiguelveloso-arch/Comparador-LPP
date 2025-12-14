
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Loader2, Globe } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithProvider } = useAuth();
  const navigate = useNavigate();

  const handlePostLogin = (user: any) => {
      // If user has no saved profile (e.g. first time social login), send to quiz
      if (!user.savedProfile) {
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
      setError(err?.toString() || 'Login falhou');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
      setError('');
      setIsLoading(true);
      try {
          const user = await loginWithProvider(provider);
          handlePostLogin(user);
      } catch (err: any) {
          setError('Autenticação social falhou');
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-4 bg-padel-black bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative bg */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-padel-lime/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-950 rounded-xl border border-zinc-800 mb-4 text-padel-lime">
                <Activity size={24} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Bem-vindo de volta</h1>
            <p className="text-zinc-500 text-xs font-mono mt-2">ACEDE AOS TEUS DADOS GUARDADOS</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase mb-6">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
            <button 
                type="button"
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 py-3 bg-white text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors font-bold text-xs uppercase tracking-wide"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
            </button>
            <button 
                type="button"
                onClick={() => handleSocialLogin('facebook')}
                className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors font-bold text-xs uppercase tracking-wide"
            >
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                 </svg>
                 Facebook
            </button>
        </div>

        <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-zinc-900 text-zinc-500 font-mono">Ou continuar com email</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-padel-lime uppercase tracking-widest">Endereço de Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                        type="email" 
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-padel-lime focus:ring-1 focus:ring-padel-lime outline-none transition-all placeholder-zinc-700"
                        placeholder="jogador@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-padel-lime uppercase tracking-widest">Palavra-passe</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                        type="password" 
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-padel-lime focus:ring-1 focus:ring-padel-lime outline-none transition-all placeholder-zinc-700"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-padel-lime hover:bg-lime-400 text-padel-black font-black uppercase py-3 rounded-lg tracking-wide transition-all flex items-center justify-center gap-2 mt-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Entrar <ArrowRight size={18} /></>}
            </button>
        </form>

        <div className="mt-6 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-500 text-xs">Não tens conta?</p>
            <Link to="/register" className="text-white text-xs font-bold uppercase hover:underline mt-1 inline-block">
                Criar Perfil de Jogador
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
