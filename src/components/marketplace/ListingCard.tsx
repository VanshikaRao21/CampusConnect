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

  // Condition Badge Styling (BlurAdmin Dark Theme)
  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'Like New':
        return 'bg-teal-950/80 text-teal-300 border-teal-500/30';
      case 'Good':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
    }
  };

  const isSold = listing.status === 'SOLD';

  return (
    <div
      onClick={() => onSelect(listing)}
      className="glass-card group relative rounded-2xl flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative w-full aspect-[4/3] bg-slate-900 overflow-hidden">
        {listing.imagePath && !imageError ? (
          <img
            src={listing.imagePath}
            alt={listing.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 to-[#112233] text-slate-500 p-4 text-center">
            <Tag className="w-8 h-8 mb-2 opacity-40 text-teal-400" />
            <span className="text-xs font-medium">Academic Item</span>
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-900/85 backdrop-blur-md text-teal-300 border border-teal-500/30 shadow-xs">
            {listing.category}
          </span>
        </div>

        {/* Status / Sold Overlay */}
        {isSold ? (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-red-500/90 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-2xs backdrop-blur-md ${getConditionStyle(listing.condition)}`}>
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
            <div className="flex items-baseline text-white">
              <span className="text-base font-bold text-[#00D2B4] mr-0.5">₹</span>
              <span className="text-2xl font-black tracking-tight text-[#00D2B4] drop-shadow-xs">
                {listing.price.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-white text-base leading-snug line-clamp-2 group-hover:text-[#00D2B4] transition-colors">
            {listing.title}
          </h3>

          {/* Description Excerpt */}
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>

        {/* Card Footer: Handover & Quick Action */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-md flex items-center gap-1 border border-teal-500/30">
            <CheckCircle2 className="w-3 h-3 text-[#00D2B4]" />
            Campus Pickup
          </span>
          <span className="text-xs font-bold text-[#00D2B4] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
            Details <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
