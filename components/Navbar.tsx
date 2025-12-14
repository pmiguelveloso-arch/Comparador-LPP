
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Activity, UserCircle2, Search, ChevronDown, ScanLine, LogOut, User as UserIcon } from 'lucide-react';
import { BRANDS } from '../data/rackets';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on click outside (only needed for click interactions, hover handles most)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setBrandsOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Raquetes', path: '/explore' },
    { name: 'Compatibilidade', path: '/match' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-padel-black/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo Area */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-padel-lime rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                  <Activity size={20} className="text-padel-black" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg tracking-tighter leading-none text-white uppercase italic">
                    LOUCOS POR <span className="text-padel-lime">PADEL</span>
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest">GEAR ANALYTICS V2.0</span>
                </div>
              </Link>
              
              {/* Desktop Nav */}
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

                {/* Brands Dropdown - Hover to open, Click to visit /brands */}
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
                           <div className="px-4 py-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1">Selecionar Marca</div>
                           {BRANDS.map(brand => (
                             <Link
                               key={brand}
                               to={`/brands/${brand}`}
                               className="block px-4 py-2 text-sm text-zinc-300 hover:text-padel-lime hover:bg-white/5 transition-colors font-medium"
                             >
                               {brand}
                             </Link>
                           ))}
                           <Link to="/brands" className="block px-4 py-2 text-[10px] text-center font-bold text-zinc-500 hover:text-white border-t border-white/5 uppercase mt-1 tracking-wider">
                              Ver Todas
                           </Link>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Link to="/scanner" className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-padel-lime hover:bg-padel-lime hover:text-padel-black transition-colors group">
                <ScanLine size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Scanner IA</span>
              </Link>

              <Link to="/explore" className="p-2 text-zinc-400 hover:text-white transition-colors">
                <Search size={20} />
              </Link>

              {/* User Menu / Login */}
              {isAuthenticated ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                   <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 pl-4 border-l border-white/10"
                   >
                     <div className="text-right">
                        <div className="text-[10px] text-zinc-500 font-mono">ID JOGADOR</div>
                        <div className="text-xs font-bold text-white max-w-[100px] truncate">{user?.name}</div>
                     </div>
                     <UserCircle2 size={32} className="text-zinc-600 hover:text-white transition-colors" />
                   </button>

                   {userMenuOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl py-2 animate-fade-in-up">
                         <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                            <UserIcon size={14} /> Perfil
                         </Link>
                         <button 
                           onClick={logout}
                           className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                         >
                            <LogOut size={14} /> Sair
                         </button>
                      </div>
                   )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
                   <Link to="/login" className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider px-2">
                     Entrar
                   </Link>
                   <Link to="/register" className="bg-white text-padel-black px-4 py-2 rounded font-bold uppercase text-xs tracking-wider hover:bg-zinc-200 transition-colors">
                     Registar
                   </Link>
                </div>
              )}
              
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

        {/* Mobile menu */}
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
                className={`flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border ${
                  isActive('/brands')
                    ? 'bg-padel-lime text-padel-black border-padel-lime'
                    : 'bg-zinc-900 border-white/5 text-zinc-400'
                }`}
              >
                Marcas
                <ChevronDown size={20} />
              </Link>

              <Link
                to="/scanner"
                className={`flex items-center justify-between px-6 py-4 rounded-xl text-lg font-bold uppercase tracking-wide border ${
                  isActive('/scanner')
                    ? 'bg-padel-lime text-padel-black border-padel-lime'
                    : 'bg-zinc-900 border-white/5 text-zinc-400'
                }`}
              >
                Scanner IA
                <ScanLine size={20} />
              </Link>

              <div className="pt-6 border-t border-white/10">
                 <div className="px-2 text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Índice de Fabricantes</div>
                 <div className="grid grid-cols-2 gap-3">
                   {BRANDS.map(brand => (
                      <Link 
                        key={brand}
                        to={`/brands/${brand}`}
                        className="p-3 bg-zinc-900/50 rounded-lg text-center text-sm font-bold text-zinc-300 border border-zinc-800 hover:border-padel-lime hover:text-white transition-colors"
                      >
                        {brand}
                      </Link>
                   ))}
                 </div>
              </div>
              
              <div className="pt-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link to="/profile" className="flex items-center gap-3 px-6 py-4 rounded-xl bg-zinc-900 border border-white/5">
                      <UserCircle2 className="text-zinc-400" />
                      <div>
                          <div className="text-white font-bold">{user?.name}</div>
                          <div className="text-zinc-500 text-xs font-mono">Ver Perfil</div>
                      </div>
                    </Link>
                    <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase">
                       <LogOut size={16} /> Sair
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     <Link to="/login" className="flex items-center justify-center py-4 rounded-xl border border-zinc-700 text-white font-bold uppercase">
                        Entrar
                     </Link>
                     <Link to="/register" className="flex items-center justify-center py-4 rounded-xl bg-white text-padel-black font-bold uppercase">
                        Registar
                     </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
