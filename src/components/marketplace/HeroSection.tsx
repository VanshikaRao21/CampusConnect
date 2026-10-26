'use client';

import React from 'react';
import NextLink from 'next/link';
import { Search, Sparkles, ArrowRight, ShieldCheck, Tag, Zap, BookOpen } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory: (cat: string) => void;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  onSelectCategory,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 -z-10 w-72 h-72 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Gen Z Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>The College Academic Exchange Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <span className="text-blue-700 dark:text-blue-300 font-bold">100% Free for Students</span>
        </div>

        {/* Primary Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-[1.12]">
          Your campus.{' '}
          <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-blue-500 bg-clip-text text-transparent">
            Your finds.
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Buy and sell verified second-hand textbooks, scientific calculators, lab coats, and academic supplies directly with batchmates. Save up to 70% every semester.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center shadow-lg shadow-blue-500/10 dark:shadow-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-900 transition-all">
            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, subject, or author (e.g. Engineering Maths, Casio fx-991EX)..."
              className="w-full px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 bg-transparent border-0 focus:outline-none"
            />
            <NextLink
              href="/create-listing"
              className="shrink-0 hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
            >
              <span>Sell Item</span>
              <ArrowRight className="w-4 h-4" />
            </NextLink>
          </div>

          {/* Quick Popular Tags */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Popular:</span>
            <button
              onClick={() => onSelectCategory('Textbooks')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              📚 Textbooks
            </button>
            <button
              onClick={() => onSelectCategory('Calculators')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              🔢 Calculators
            </button>
            <button
              onClick={() => onSelectCategory('Lab Equipment')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              🥼 Lab Gear
            </button>
            <button
              onClick={() => onSelectCategory('Stationery')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors"
            >
              📐 Drafters
            </button>
          </div>
        </div>

        {/* Feature Trust Pills */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Verified Campus Peer-to-Peer</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-lime-100 dark:bg-lime-950 flex items-center justify-center text-lime-700 dark:text-lime-400 shrink-0">
              <Tag className="w-4 h-4" />
            </div>
            <span>Zero Brokerage / Fees</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-950 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <span>Instant In-Person Pickup</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <span>Academic Essentials Only</span>
          </div>
        </div>

      </div>
    </section>
  );
}
