'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Tag, 
  Sparkles, 
  ArrowUpRight, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Listing } from '../../types/listing';

interface ListingCardProps {
  listing: Listing;
  onSelect: (listing: Listing) => void;
}

export default function ListingCard({ listing, onSelect }: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  // Formatted date
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  // Condition Badge Styling
  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Like New':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Good':
        return 'bg-violet-50 text-violet-700 border-violet-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const isSold = listing.status === 'SOLD';

  return (
    <div
      onClick={() => onSelect(listing)}
      className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
        {listing.imagePath && !imageError ? (
          <img
            src={listing.imagePath}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-400 p-4 text-center">
            <Tag className="w-8 h-8 mb-1 text-slate-400" />
            <span className="text-xs font-medium">Campus Item</span>
          </div>
        )}

        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide uppercase bg-white/95 backdrop-blur-md text-slate-800 shadow-sm border border-slate-200/80">
            {listing.category}
          </span>
        </div>

        {/* Status / Sold Overlay */}
        {isSold ? (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${getConditionStyle(listing.condition)}`}>
              {listing.condition}
            </span>
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline text-slate-900">
              <span className="text-base font-bold text-blue-600 mr-0.5">₹</span>
              <span className="text-2xl font-black tracking-tight">{listing.price.toLocaleString('en-IN')}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          {/* Description Excerpt */}
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Card Footer: Handover & Quick Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Campus Pickup
          </span>
          <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
