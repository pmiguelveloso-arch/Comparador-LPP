import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-padel-black text-zinc-600 py-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
           <span className="font-black text-white text-lg block uppercase italic tracking-tighter">LOUCOS POR <span className="text-padel-lime">PADEL</span></span>
           <span className="text-[10px] font-mono uppercase tracking-widest">Advanced Gear Analytics</span>
        </div>
        <div className="text-center md:text-right">
            <p className="text-xs font-mono">© 2024 LOUCOS POR PADEL. ALL RIGHTS RESERVED.</p>
            <p className="text-[10px] mt-2 max-w-md opacity-50">
              Demo Version 2.0.4 | Biometric Data Local Storage Only.
            </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;