
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err: any) {
      setError(err?.toString() || 'Login failed');
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
            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">Welcome Back</h1>
            <p className="text-zinc-500 text-xs font-mono mt-2">ACCESS YOUR SAVED GEAR DATA</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2 text-xs font-bold uppercase mb-6">
                <AlertCircle size={16} /> {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-padel-lime uppercase tracking-widest">Email Address</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                    <input 
                        type="email" 
                        required
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-padel-lime focus:ring-1 focus:ring-padel-lime outline-none transition-all placeholder-zinc-700"
                        placeholder="player@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-bold text-padel-lime uppercase tracking-widest">Password</label>
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
                className="w-full bg-white hover:bg-zinc-200 text-padel-black font-black uppercase py-3 rounded-lg tracking-wide transition-all flex items-center justify-center gap-2 mt-2"
            >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
        </form>

        <div className="mt-6 text-center border-t border-zinc-800 pt-6">
            <p className="text-zinc-500 text-xs">Don't have an account?</p>
            <Link to="/register" className="text-padel-lime text-xs font-bold uppercase hover:underline mt-1 inline-block">
                Create Player Profile
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
