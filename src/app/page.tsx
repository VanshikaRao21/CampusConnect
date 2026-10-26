'use client';

import React, { useState, useEffect, useMemo } from 'react';
import NextLink from 'next/link';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Database, 
  Cloud, 
  BookOpen, 
  ShoppingBag,
  ExternalLink,
  Users,
  IndianRupee,
  Layers,
  Search,
  ArrowUpRight,
  PlusCircle,
  RotateCcw
} from 'lucide-react';
import HeroSection from '../components/marketplace/HeroSection';
import CategoryBar from '../components/marketplace/CategoryBar';
import SearchAndFilterBar from '../components/marketplace/SearchAndFilterBar';
import ListingGrid from '../components/marketplace/ListingGrid';
import ListingDetailModal from '../components/marketplace/ListingDetailModal';
import HowItWorks from '../components/marketplace/HowItWorks';
import { Listing, FilterState } from '../types/listing';
import { dataClient, authClient } from '../lib/amplifyClient';

export default function HomePage() {
  const [user, setUser] = useState({ userId: '', email: '', isAuthenticated: false });
  const [viewMode, setViewMode] = useState<'landing' | 'marketplace'>('landing');
  
  // Marketplace state
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  // Auth form state for Landing Page
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    condition: '',
    minPrice: 0,
    maxPrice: 2500,
    sortBy: 'newest',
  });

  // Check auth and initial view mode
  useEffect(() => {
    const currentUser = authClient.getCurrentUser();
    setUser(currentUser);
    if (currentUser.isAuthenticated) {
      setViewMode('marketplace');
    }

    const handleAuthChange = () => {
      const updated = authClient.getCurrentUser();
      setUser(updated);
      if (updated.isAuthenticated) {
        setViewMode('marketplace');
      }
    };

    window.addEventListener('campusconnect_auth_updated', handleAuthChange);
    return () => window.removeEventListener('campusconnect_auth_updated', handleAuthChange);
  }, []);

  // Fetch listings from dataClient
  const loadListings = async () => {
    try {
      setIsLoading(true);
      const data = await dataClient.getListings();
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();

    const handleDataChange = () => {
      loadListings();
    };

    window.addEventListener('campusconnect_data_updated', handleDataChange);
    return () => window.removeEventListener('campusconnect_data_updated', handleDataChange);
  }, []);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: '',
      condition: '',
      minPrice: 0,
      maxPrice: 2500,
      sortBy: 'newest',
    });
  };

  // Auth form handlers
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password.trim()) throw new Error('Please enter email and password.');
      const loggedUser = await authClient.signIn(email.trim(), password);
      setAuthSuccess(`Welcome, ${loggedUser.email}!`);
      setTimeout(() => setViewMode('marketplace'), 700);
    } catch (err: any) {
      setAuthError(err?.message || 'Cognito authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (!email.trim() || !password.trim()) throw new Error('Please enter email and password.');
      if (password !== confirmPassword) throw new Error('Passwords do not match.');
      if (password.length < 8) throw new Error('Password must be at least 8 characters.');
      const res = await authClient.signUp(email.trim(), password);
      if (res.isSignUpComplete) {
        setAuthSuccess('Account registered and verified!');
        setTimeout(() => setViewMode('marketplace'), 700);
      } else {
        setNeedsVerification(true);
        setAuthSuccess('Verification code sent to your email.');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      if (!code.trim()) throw new Error('Please enter verification code.');
      await authClient.confirmSignUp(email.trim(), code.trim());
      setAuthSuccess('Verified successfully!');
      setTimeout(() => setViewMode('marketplace'), 700);
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOneClickDemoLogin = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const demo = await authClient.signIn('student@college.edu', 'CampusConnect2026!');
      setAuthSuccess(`Authenticated as ${demo.email}! Entering Marketplace...`);
      setTimeout(() => setViewMode('marketplace'), 600);
    } catch (err: any) {
      setAuthError('Demo login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCategory = item.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
        }
        if (filters.category && item.category !== filters.category) return false;
        if (filters.condition && item.condition !== filters.condition) return false;
        if (item.price > filters.maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, filters]);

  return (
    <div className="min-h-screen bg-[#0B1320] text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* =========================================================================
          VIEW 1: BEAUTIFUL BLURADMIN CYBER-TEAL LANDING PAGE
      ========================================================================= */}
      {viewMode === 'landing' ? (
        <div className="flex-1 flex flex-col justify-between">
          
          {/* Top BlurAdmin Live Stats Dashboard Bar */}
          <div className="border-b border-[#1C334A] bg-[#0D1B2A]/90 backdrop-blur-md py-3 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#112233]/70 border border-[#1C334A]/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/30 flex items-center justify-center text-[#00D2B4]">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Active Students</div>
                  <div className="text-sm font-black text-white">1,240+ Verified</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#112233]/70 border border-[#1C334A]/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-[#06B6D4]">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Student Savings</div>
                  <div className="text-sm font-black text-[#00D2B4]">₹4,80,000+</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#112233]/70 border border-[#1C334A]/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Safety Rating</div>
                  <div className="text-sm font-black text-white">100% In-Person</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#112233]/70 border border-[#1C334A]/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Cloud Backend</div>
                  <div className="text-sm font-black text-white">AWS Amplify Gen 2</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Landing Hero & Cognito Auth Gateway */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Value Pitch */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/70 border border-teal-500/30 text-[#00D2B4] text-xs font-bold tracking-wide">
                  <Sparkles className="w-4 h-4" />
                  <span>The Official Campus Academic Exchange Platform</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.12]">
                  Your campus.{' '}
                  <span className="bg-gradient-to-r from-[#00D2B4] via-[#26E5C8] to-[#06B6D4] bg-clip-text text-transparent">
                    Your finds.
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                  Buy and sell verified second-hand textbooks, scientific calculators, lab coats, and engineering drafters directly with batchmates. Save up to 70% with zero brokerage and instant campus pickups.
                </p>

                {/* Direct CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setViewMode('marketplace')}
                    className="btn-teal py-3 px-6 rounded-xl flex items-center gap-2 text-sm font-bold shadow-teal"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Explore Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <NextLink
                    href="/about"
                    className="py-3 px-5 rounded-xl bg-[#112233] hover:bg-[#172d42] border border-[#1C334A] text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Cloud className="w-4 h-4 text-[#00D2B4]" />
                    <span>AWS Architecture Diagram</span>
                  </NextLink>
                </div>

                {/* 4 AWS Microservices Grid */}
                <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#0D1B2A]/90 border border-[#1C334A] shadow-2xs">
                    <div className="text-[#00D2B4] font-bold text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Cognito
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Encrypted JWT auth & student tokens</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D1B2A]/90 border border-[#1C334A] shadow-2xs">
                    <div className="text-[#06B6D4] font-bold text-xs flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" /> AppSync
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Managed GraphQL query gateway</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D1B2A]/90 border border-[#1C334A] shadow-2xs">
                    <div className="text-[#10B981] font-bold text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> DynamoDB
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Single-digit ms NoSQL listing store</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D1B2A]/90 border border-[#1C334A] shadow-2xs">
                    <div className="text-teal-400 font-bold text-xs flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5" /> S3 Bucket
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">Scoped product image storage</div>
                  </div>
                </div>

              </div>

              {/* Right Column: Amazon Cognito Authentication Card */}
              <div className="lg:col-span-5">
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/20 shadow-2xl relative overflow-hidden">
                  
                  {/* Subtle top glowing accent */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00D2B4] via-[#06B6D4] to-[#10B981]" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-5 border-b border-[#1C334A]">
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tight">Student Portal</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Sign in to list items & manage campus trades</p>
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-[11px] font-bold text-[#00D2B4]">
                      <Lock className="w-3 h-3 text-[#00D2B4]" />
                      <span>Cognito</span>
                    </div>
                  </div>

                  {/* 1-Click Fast Evaluator Login for Demonstrations */}
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-teal-950/40 to-[#112233] border border-teal-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00D2B4] text-[#0B1320] flex items-center justify-center shrink-0 shadow-sm mt-0.5 font-black">
                        <Zap className="w-4 h-4 fill-current" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Evaluator Login</h4>
                        <p className="text-xs text-slate-300 mt-0.5">
                          1-click demo login with college credential (<code className="text-[#00D2B4] font-mono">student@college.edu</code>).
                        </p>
                        <button
                          onClick={handleOneClickDemoLogin}
                          disabled={isSubmitting}
                          className="mt-3 w-full py-2.5 px-3 rounded-xl btn-teal text-xs font-bold shadow-teal flex items-center justify-center gap-1.5"
                        >
                          <span>Instant 1-Click Student Sign-In</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications */}
                  {authSuccess && (
                    <div className="mt-4 p-3 rounded-xl bg-teal-950/80 border border-teal-500/40 text-xs font-medium text-teal-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00D2B4] shrink-0" />
                      <span>{authSuccess}</span>
                    </div>
                  )}

                  {authError && (
                    <div className="mt-4 p-3 rounded-xl bg-red-950/80 border border-red-800 text-xs font-medium text-red-200">
                      {authError}
                    </div>
                  )}

                  {/* Sign In & Sign Up Form */}
                  {!needsVerification ? (
                    <div className="mt-5">
                      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#09111C] mb-4 text-xs font-bold border border-[#1C334A]">
                        <button
                          onClick={() => { setAuthTab('signin'); setAuthError(null); }}
                          className={`py-2 rounded-lg transition-all ${
                            authTab === 'signin'
                              ? 'bg-[#172D42] text-[#00D2B4] shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => { setAuthTab('signup'); setAuthError(null); }}
                          className={`py-2 rounded-lg transition-all ${
                            authTab === 'signup'
                              ? 'bg-[#172D42] text-[#00D2B4] shadow-xs'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Create Account
                        </button>
                      </div>

                      <form onSubmit={authTab === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                            College Email
                          </label>
                          <div className="relative">
                            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="rollnumber@college.edu"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1C334A] bg-[#09111C] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                            <input
                              type="password"
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1C334A] bg-[#09111C] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4]"
                            />
                          </div>
                        </div>

                        {authTab === 'signup' && (
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                              <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#1C334A] bg-[#09111C] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00D2B4] focus:ring-1 focus:ring-[#00D2B4]"
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#172D42] hover:bg-[#1E3A54] border border-teal-500/30 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2"
                        >
                          <span>{authTab === 'signin' ? 'Sign In with Cognito' : 'Register with College ID'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#00D2B4]" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyCode} className="mt-5 space-y-3.5">
                      <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-xs text-teal-200">
                        Enter the 6-digit confirmation code generated by Amazon Cognito.
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                          Confirmation Code
                        </label>
                        <input
                          type="text"
                          required
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="123456"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#1C334A] bg-[#09111C] text-center tracking-widest text-lg font-mono font-bold text-white focus:outline-none focus:border-[#00D2B4]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl btn-teal text-xs font-bold"
                      >
                        Verify & Enter Marketplace
                      </button>
                    </form>
                  )}

                  {/* Guest Continue Footer */}
                  <div className="mt-5 pt-4 border-t border-[#1C334A] text-center">
                    <button
                      onClick={() => setViewMode('marketplace')}
                      className="text-xs font-semibold text-slate-400 hover:text-[#00D2B4] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Skip to Marketplace as Guest</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00D2B4]" />
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </main>

          {/* Quick Listings Preview Carousel/Strip on Landing Page */}
          <div className="border-t border-[#1C334A] bg-[#09111C]/80 py-8 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Popular on Campus Right Now</h3>
                  <p className="text-xs text-slate-500">Recently listed academic tools ready for instant pickup</p>
                </div>
                <button
                  onClick={() => setViewMode('marketplace')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00D2B4] hover:underline"
                >
                  <span>View All {listings.length} Items</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {listings.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { setSelectedListing(item); setViewMode('marketplace'); }}
                    className="glass-card p-3 rounded-2xl flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden shrink-0 border border-[#1C334A]">
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <BookOpen className="w-6 h-6 text-[#00D2B4]" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-[#00D2B4] uppercase">{item.category}</div>
                      <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                      <div className="text-sm font-black text-[#00D2B4] mt-0.5">₹{item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* =========================================================================
            VIEW 2: FULL MAIN MARKETPLACE WEBSITE
        ========================================================================= */
        <div className="flex-1 flex flex-col">
          
          {/* Top Return-to-Landing / Mode Banner */}
          <div className="bg-[#0D1B2A] border-b border-[#1C334A] px-4 py-2 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D2B4] animate-pulse"></span>
              <span className="text-slate-300">
                Browsing Marketplace as <strong className="text-white">{user.isAuthenticated ? user.email : 'Guest Student'}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode('landing')}
                className="text-slate-400 hover:text-[#00D2B4] font-semibold transition-colors flex items-center gap-1"
              >
                <span>← Back to Landing Page</span>
              </button>
              <NextLink
                href="/create-listing"
                className="btn-teal py-1 px-3 rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Sell an Item</span>
              </NextLink>
            </div>
          </div>

          {/* Hero Section */}
          <HeroSection
            searchQuery={filters.searchQuery}
            onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
          />

          {/* Category Bar */}
          <CategoryBar
            selectedCategory={filters.category}
            onSelectCategory={(cat) => handleFilterChange({ category: cat })}
          />

          {/* Main Marketplace Grid Area */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
            
            {/* Filter Bar */}
            <SearchAndFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={filteredListings.length}
            />

            {/* Listing Grid */}
            <ListingGrid
              listings={filteredListings}
              isLoading={isLoading}
              onSelectListing={(item) => setSelectedListing(item)}
              onResetFilters={handleResetFilters}
            />

            {/* How It Works section */}
            <div className="mt-16">
              <HowItWorks />
            </div>

          </main>

          {/* Listing Detail Modal */}
          {selectedListing && (
            <ListingDetailModal
              listing={selectedListing}
              onClose={() => setSelectedListing(null)}
            />
          )}

        </div>
      )}

    </div>
  );
}
