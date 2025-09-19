'use client';

import React from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  title: string;
  openSidebar: () => void;
};

export default function Header({ title, openSidebar }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center p-4 border-b border-[color:var(--border)]">
      <div className="flex items-center">
        <button className="mr-4 md:hidden" onClick={openSidebar}>
          <Menu className="h-6 w-6 text-[color:var(--foreground)]" />
        </button>
        <h1 className="text-xl font-bold text-[color:var(--heading)]">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Buscar..."
            className="input pl-10 pr-4 py-1.5 text-sm rounded-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <button className="relative p-1 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6 text-[color:var(--foreground)]" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[color:var(--primary)] text-white flex items-center justify-center text-sm font-semibold">
            B
          </div>
          <span className="hidden md:block text-sm font-medium text-[color:var(--foreground)]">
            Admin
          </span>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100">
          <LogOut className="h-6 w-6 text-[color:var(--foreground)]" />
          <span className="hidden md:block text-sm font-medium text-[color:var(--foreground)]">Sair</span>
        </button>
      </div>
    </header>
  );
}