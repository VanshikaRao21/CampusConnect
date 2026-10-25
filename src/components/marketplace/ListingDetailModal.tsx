'use client';

import React, { useEffect, useState } from 'react';
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
  HardDrive,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Listing } from '../../types/listing';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
}

export default function ListingDetailModal({ listing, onClose }: ListingDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listing, onClose]);

  if (!listing) return null;

  const isSold = listing.status === 'SOLD';
  const formattedDate = new Date(listing.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Like New':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Good':
        return 'bg-violet-100 text-violet-800 border-violet-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const whatsappPhone = listing.contactPhone ? listing.contactPhone.replace(/[^0-9]/g, '') : '';
  const emailSubject = `CampusConnect Inquiry: ${listing.title}`;
  const emailBody = `Hi,\n\nI am interested in your listing "${listing.title}" (₹${listing.price}) posted on CampusConnect.\n\nCould we arrange a meeting on campus to inspect the item?\n\nThank you!`;
  const whatsappText = `Hi, I saw your listing for "${listing.title}" (₹${listing.price}) on CampusConnect. Is this still available for on-campus handover?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {listing.category}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getConditionStyle(listing.condition)}`}>
              Condition: {listing.condition}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Full-size High-Resolution Photo */}
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-200 flex items-center justify-center">
            {listing.imagePath && !imageError ? (
              <img
                src={listing.imagePath}
                alt={listing.title}
                className="w-full h-full object-contain bg-slate-950/5"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <Tag className="w-12 h-12 mb-2 text-slate-300" />
                <span className="text-sm font-medium">No photo available</span>
              </div>
            )}

            {/* S3 Storage Asset Badge */}
            <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-sm">
              <HardDrive className="w-3 h-3 text-blue-400" />
              <span>Amazon S3 Photo</span>
            </div>

            {isSold && (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-5 py-2.5 rounded-full bg-red-600 text-white font-black text-sm uppercase tracking-widest shadow-2xl">
                  Item Sold Out
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

            {/* Badges: Verified Student & Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Listed on {formattedDate}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Student Status
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Campus Handover
              </span>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Item Details & Condition
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
              {listing.description}
            </div>
          </div>

          {/* Safe Seller Contact Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact Seller
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Seller</span>
                </a>
              )}
              {listing.contactPhone && (
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappText)}`}
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

          {/* Campus Safety Advisory Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-950 block text-sm">
                Campus Safety Advisory
              </span>
              <p className="text-amber-800 leading-relaxed">
                For your safety, always arrange to meet in daylight inside campus common areas such as the campus library or student canteen. Inspect the item thoroughly before making any payment.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer: AWS Metadata */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>DynamoDB: <code className="text-blue-600 font-mono text-[11px]">{listing.id}</code></span>
            {listing.s3Key && (
              <span>S3 Key: <code className="text-emerald-700 font-mono text-[11px] truncate max-w-[200px] inline-block align-bottom">{listing.s3Key}</code></span>
            )}
          </div>
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
