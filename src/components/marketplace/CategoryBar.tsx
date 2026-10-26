'use client';

import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Compass, 
  Headphones, 
  LayoutGrid,
  Sparkles
} from 'lucide-react';
import { ItemCategory } from '../../types/listing';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
}: CategoryBarProps) {
  const categories = [
    { id: 'ALL', name: 'All Categories', icon: LayoutGrid, count: 'All' },
    { id: 'Textbooks', name: 'Textbooks', icon: BookOpen, count: 'Books' },
    { id: 'Calculators', name: 'Calculators', icon: Calculator, count: 'Scientific' },
    { id: 'Lab Equipment', name: 'Lab Gear', icon: FlaskConical, count: 'Coats & Kits' },
    { id: 'Stationery', name: 'Stationery', icon: Compass, count: 'Drafters & Sets' },
    { id: 'Accessories', name: 'Accessories', icon: Headphones, count: 'Tech & Study' },
  ];

  return (
    <div className="py-4 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-16 z-30 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected =
              (cat.id === 'ALL' && !selectedCategory) ||
              selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id === 'ALL' ? '' : cat.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 scale-[1.02]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
