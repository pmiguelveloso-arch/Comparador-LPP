
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Activity, Search, ChevronDown, ScanLine, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { BRANDS } from '../data/rackets';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setBrandsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Explorar', path: '/explore' },
    { name: 'Raquete Ideal', path: '/match' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-padel-black/95 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-padel-lime rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <Activity size={20} className="text-padel-black" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tighter leading-none text-white uppercase italic">
                    LOUCOS POR <span className="text-padel-lime">PADEL</span>
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest">PRO GEAR ANALYTICS</span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive(link.path)
                        ? 'text-padel-lime bg-padel-lime/10 border border-padel-lime/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div 
                  className="relative h-full flex items-center" 
                  ref={dropdownRef}
                  onMouseEnter={() => setBrandsOpen(true)}
                  onMouseLeave={() => setBrandsOpen(false)}
                >
                  <Link
                    to="/brands"
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      location.pathname.includes('/brands') || brandsOpen
                        ? 'text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Marcas
                    <ChevronDown size={14} className={`transition-transform duration-200 ${brandsOpen ? 'rotate-180' : ''}`} />
                  </Link>
                  
                  {brandsOpen && (
                    <div className="absolute top-full left-0 w-48 pt-2">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 animate-fade-in-up overflow-hidden">
                           <div className="px-4 py-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">Escolher Marca</div>
                           {BRANDS.map(brand => (
                             <Link
                               key={brand}
                               to={`/brands/${brand}`}
                               className="block px-4 py-2 text-sm text-zinc-300 hover:text-padel-lime hover:bg-white/5 transition-colors font-medium"
                             >
                               {brand}
                             </Link>
                           ))}
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/scanner" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-padel-lime hover:bg-padel-lime hover:text-padel-black transition-colors group">
                <ScanLine size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Identificar</span>
              </Link>

              {/* AUTH SECTION */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 md:pl-1.5 md:pr-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-padel-lime transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-padel-lime flex items-center justify-center text-padel-black font-black text-xs uppercase">
                      {user?.name?.charAt(0) || <User size={16} />}
                    </div>
                    <span className="hidden md:block text-[10px] font-black text-white uppercase tracking-wider truncate max-w-[80px]">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={12} className={`text-zinc-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-padel-black hover:bg-padel-lime transition-all"
                  >
                    <User size={16} strokeWidth={2.5} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Entrar</span>
                  </Link>
                )}

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 pt-1">
                    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl py-2 overflow-hidden animate-fade-in-up">
                       <div className="px-4 py-3 border-b border-white/5 bg-zinc-950/50 mb-1">
                          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">Sessão Ativa</div>
                          <div className="text-sm font-bold text-white truncate">{user?.email}</div>
                       </div>
                       
                       <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                          <LayoutDashboard size={16} className="text-zinc-500" />
                          <span className="font-bold uppercase tracking-widest text-[10px]">O meu Perfil</span>
                       </Link>
                       
                       <Link to="/match" className="flex items-center gap-3 px-4 py-3 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                          <Activity size={16} className="text-zinc-500" />
                          <span className="font-bold uppercase tracking-widest text-[10px]">Meus Matches</span>
                       </Link>

                       <div className="h-px bg-white/5 my-1 mx-2"></div>

                       <button 
                         onClick={() => {
                           logout();
                           setUserMenuOpen(false);
                         }}
                         className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                       >
                          <LogOut size={16} />
                          <span className="font-bold uppercase tracking-widest text-[10px]">Terminar Sessão</span>
                       </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-zinc-400 hover:text-white"
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-padel-black border-b border-white/5 absolute w-full h-[calc(100vh-64px)] backdrop-blur-xl z-50 overflow-y-auto">
            <div className="px-4 pt-8 pb-12 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border ${
                    isActive(link.path)
                      ? 'bg-padel-lime text-padel-black border-padel-lime'
                      : 'bg-zinc-900 border-white/5 text-zinc-400'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && <Activity size={20} />}
                </Link>
              ))}

              <Link
                to="/brands"
                className="flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border bg-zinc-900 border-white/5 text-zinc-400"
              >
                Marcas
                <ChevronDown size={20} />
              </Link>

              <Link
                to="/scanner"
                className="flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border bg-zinc-900 border-white/5 text-zinc-400"
              >
                Identificar Raquete
                <ScanLine size={20} />
              </Link>

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-black uppercase tracking-wide bg-white text-padel-black mt-8"
                >
                  Entrar na Conta <User size={20} />
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
