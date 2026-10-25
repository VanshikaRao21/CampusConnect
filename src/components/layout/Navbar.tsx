'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  PlusCircle, 
  Layers, 
  Info, 
  User, 
  Menu, 
  X, 
  CloudCheck, 
  Sparkles,
  Database
} from 'lucide-react';
import { authClient } from '../../lib/amplifyClient';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ userId: '', email: '', isAuthenticated: false });
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    authClient.restoreSession().then(setUser);

    const handleAuthChange = () => {
      setUser(authClient.getCurrentUser());
    };

    window.addEventListener('campusconnect_auth_updated', handleAuthChange);
    return () => window.removeEventListener('campusconnect_auth_updated', handleAuthChange);
  }, []);

  const handleSignOut = async () => { await authClient.signOut(); setUser(authClient.getCurrentUser()); };

  const navLinks = [
    { name: 'Marketplace', href: '/', icon: ShoppingBag },
    { name: 'Sell an Item', href: '/create-listing', icon: PlusCircle, isCta: true },
    { name: 'My Listings', href: '/my-listings', icon: Layers },
    { name: 'Cloud Architecture', href: '/about', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-violet-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  Campus<span className="text-blue-600">Connect</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-lime-100 text-lime-800 border border-lime-300">
                  AWS Cloud
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">Student Academic Marketplace</p>
            </div>
          </NextLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              if (link.isCta) {
                return (
                  <NextLink
                    key={link.name}
                    href={link.href}
                    className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md hover:shadow-blue-500/20 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NextLink>
                );
              }

              return (
                <NextLink
                  key={link.name}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NextLink>
              );
            })}
          </nav>

          {/* Right Area: AWS Cloud Pill & User Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Live Cloud Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 text-xs font-medium text-slate-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>AppSync + DynamoDB</span>
            </div>

            {/* User Profile */}
            {user.isAuthenticated ? <div className="flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 py-1.5 pl-2 pr-2" title={user.email}>
              <div className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">
                {user.email ? user.email.charAt(0).toUpperCase() : 'S'}
              </div>
              <NextLink href="/my-listings" className="max-w-[150px] truncate text-xs font-semibold text-violet-900">{user.email}</NextLink>
              <button onClick={handleSignOut} className="rounded-full px-2 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100">Sign out</button>
            </div> : <button onClick={() => setAuthOpen(true)} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">Student sign in</button>}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <NextLink
              href="/create-listing"
              className="p-2 rounded-lg bg-blue-600 text-white shadow-xs"
              title="Sell"
            >
              <PlusCircle className="w-5 h-5" />
            </NextLink>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <NextLink
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 text-blue-600" />
                <span>{link.name}</span>
              </NextLink>
            );
          })}
          {user.isAuthenticated ? <div className="flex items-center justify-between border-t border-slate-100 pt-3"><span className="truncate text-sm font-medium text-violet-800">{user.email}</span><button onClick={handleSignOut} className="text-sm font-bold text-red-600">Sign out</button></div> : <button onClick={() => { setAuthOpen(true); setMobileMenuOpen(false); }} className="w-full rounded-xl bg-violet-600 px-3 py-2.5 text-left text-base font-bold text-white">Student sign in</button>}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              AWS DynamoDB Connected
            </span>
            <span className="text-violet-600 font-semibold">
              {user.email ? user.email.split('@')[0] : 'Student'}
            </span>
          </div>
        </div>
      )}
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
