"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Menu, Bell, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isLogged, setIsLogged] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Just a placeholder for auth logic
    const token = localStorage.getItem('token');
    setIsLogged(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-green-600 p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900" style={{ fontFamily: 'var(--font-heading)' }}>
              AgriLinked
            </span>
          </Link>
          
          <div className="hidden md:flex space-x-6 items-center">
            {isLogged ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-green-600">Home</Link>
                <Link href="/jobs" className="text-sm font-medium text-slate-600 hover:text-green-600">Jobs</Link>
                <Link href="/network" className="text-sm font-medium text-slate-600 hover:text-green-600">Network</Link>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                </button>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200 cursor-pointer overflow-hidden ml-2" onClick={handleLogout}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`} alt="Profile" className="w-full h-full object-cover" />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition-colors shadow-sm">
                  Join Now
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button className="text-slate-400 hover:text-slate-600 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
