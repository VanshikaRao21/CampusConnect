'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  Tag, 
  Calendar, 
  Mail, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  IndianRupee, 
  CheckCircle2, 
  MapPin, 
  Share2 
} from 'lucide-react';
import { Listing } from '../../types/listing';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!listing) return null;

  const isSold = listing.status === 'SOLD';
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
              {listing.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-violet-100 text-violet-800 border border-violet-200">
              Condition: {listing.condition}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Photo */}
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={listing.imagePath}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {isSold && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-4 py-2 rounded-full bg-red-600 text-white font-black text-sm uppercase tracking-widest shadow-xl">
                  Item Has Been Sold
                </span>
              </div>
            )}
          </div>

          {/* Title & Price Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {listing.title}
              </h2>
              <div className="flex items-baseline text-blue-600 shrink-0">
                <span className="text-lg font-bold mr-0.5">₹</span>
                <span className="text-3xl font-black">{listing.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Listed on {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Student Owner
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                On-Campus Handover
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Item Overview
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          {/* Seller Contact & Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Seller Contact Options
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}?subject=CampusConnect: Inquiring about ${encodeURIComponent(listing.title)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email: {listing.contactEmail.split('@')[0]}</span>
                </a>
              )}
              {listing.contactPhone && (
                <a
                  href={`https://wa.me/${listing.contactPhone.replace(/[^0-9]/g, '')}?text=Hi,%20I%20saw%20your%20listing%20for%20"${encodeURIComponent(listing.title)}"%20on%20CampusConnect.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Seller</span>
                </a>
              )}
            </div>
          </div>

          {/* Campus Safety Warning Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Campus Safety Recommendation:</span>
              <p className="text-amber-800">
                Always inspect the item in person before payment. Meet inside campus common areas such as the college library, cafeteria, or department foyer during daytime hours.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>AWS DynamoDB Record ID: <code className="text-blue-600 font-mono">{listing.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-semibold text-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
