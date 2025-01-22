import React from 'react';
import { LogIn, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
            <Link to="/">
          <div className="flex items-center gap-2">
            <Calendar className="w-8 h-8 text-[#6B46C1]" />
            <div className="font-bold text-2xl bg-gradient-to-r from-[#6B46C1] to-[#319795] bg-clip-text text-transparent">
              EventFlow Pro
            </div>
          </div>
            </Link>
          
          <div className="flex items-center gap-6"> 
            <Link to='/login'>
            <button className="bg-[#6B46C1] hover:bg-[#5B3AA8] text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
              <LogIn className="w-5 h-5" />
              Login
            </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};