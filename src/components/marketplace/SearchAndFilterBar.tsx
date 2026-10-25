'use client';

import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  X,
  IndianRupee 
} from 'lucide-react';
import { FilterState } from '../../types/listing';

interface SearchAndFilterBarProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export default function SearchAndFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}: SearchAndFilterBarProps) {
  const conditions = ['All', 'New', 'Like New', 'Good', 'Fair'];
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.condition) ||
    filters.maxPrice < 2500 ||
    filters.sortBy !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search input with live clear */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Filter by keywords, subject, brand..."
            className="w-full pl-9 pr-9 py-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Condition Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Condition:</span>
            <select
              value={filters.condition || 'All'}
              onChange={(e) => onFilterChange({ condition: e.target.value === 'All' ? '' : e.target.value })}
              className="px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500"
            >
              {conditions.map((cond) => (
                <option key={cond} value={cond}>
                  {cond === 'All' ? 'All Conditions' : cond}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider (₹) */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
            <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-600">Under:</span>
            <span className="text-xs font-bold text-slate-900">₹{filters.maxPrice}</span>
            <input
              type="range"
              min="100"
              max="2500"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-20 sm:w-24 accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="px-3 py-2 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-blue-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Results Count & Active Tags */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium">
          Showing <span className="font-bold text-slate-900">{totalResults}</span> verified academic item{totalResults === 1 ? '' : 's'}
        </span>
        {filters.category && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
            Category: {filters.category}
            <button onClick={() => onFilterChange({ category: '' })} className="hover:text-blue-900 ml-1">
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
