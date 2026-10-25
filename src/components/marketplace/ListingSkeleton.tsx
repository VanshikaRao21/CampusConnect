import React from 'react';

export default function ListingSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden animate-pulse flex flex-col">
      <div className="w-full aspect-[4/3] bg-slate-200" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-slate-200 rounded-md" />
          <div className="h-4 w-14 bg-slate-100 rounded-md" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded-md" />
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded-md" />
          <div className="h-3 w-4/5 bg-slate-100 rounded-md" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-100 rounded-md" />
          <div className="h-4 w-12 bg-slate-200 rounded-md" />
        </div>
      </div>
    </div>
  );
}
