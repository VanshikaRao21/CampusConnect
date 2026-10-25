import React from 'react';
import NextLink from 'next/link';
import { SearchX, RotateCcw, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onReset?: () => void;
  title?: string;
  description?: string;
}

export default function EmptyState({
  onReset,
  title = 'No academic items found',
  description = 'We couldn\'t find any listings matching your search or filters. Try adjusting your keywords, price range, or category.',
}: EmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-xs">
        <SearchX className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
        <NextLink
          href="/create-listing"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Post First Listing</span>
        </NextLink>
      </div>
    </div>
  );
}
