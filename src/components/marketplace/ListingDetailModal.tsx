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
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      case 'Like New':
        return 'bg-teal-950/80 text-teal-300 border-teal-500/40';
      case 'Good':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
    }
  };

  const whatsappPhone = listing.contactPhone ? listing.contactPhone.replace(/[^0-9]/g, '') : '';
  const emailSubject = `CampusConnect Inquiry: ${listing.title}`;
  const emailBody = `Hi,\n\nI am interested in your listing "${listing.title}" (₹${listing.price}) posted on CampusConnect.\n\nCould we arrange a meeting on campus to inspect the item?\n\nThank you!`;
  const whatsappText = `Hi, I saw your listing for "${listing.title}" (₹${listing.price}) on CampusConnect. Is this still available for on-campus handover?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0D1B2A] rounded-3xl shadow-2xl border border-teal-500/25 overflow-hidden z-10 max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 border-b border-[#1C334A] bg-[#09111C]/90">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-teal-950/80 text-[#00D2B4] border border-teal-500/30 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {listing.category}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getConditionStyle(listing.condition)}`}>
              Condition: {listing.condition}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-[#172D42] transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Full-size High-Resolution Photo */}
          <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-[#1C334A] flex items-center justify-center">
            {listing.imagePath && !imageError ? (
              <img
                src={listing.imagePath}
                alt={listing.title}
                className="w-full h-full object-contain bg-slate-950"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <Tag className="w-12 h-12 mb-2 text-slate-600" />
                <span className="text-sm font-medium">No photo available</span>
              </div>
            )}

            {/* S3 Storage Asset Badge */}
            <div className="absolute top-3 left-3 bg-[#0B1320]/90 backdrop-blur-md text-[#00D2B4] text-[11px] font-mono font-medium px-2.5 py-1 rounded-lg border border-teal-500/30 flex items-center gap-1.5 shadow-sm">
              <HardDrive className="w-3 h-3 text-[#00D2B4]" />
              <span>Amazon S3 Photo</span>
            </div>

            {isSold && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                <span className="px-5 py-2.5 rounded-full bg-red-600/90 text-white font-black text-sm uppercase tracking-widest shadow-2xl">
                  Item Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Title & Price Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {listing.title}
              </h2>
              <div className="flex items-baseline text-[#00D2B4] shrink-0">
                <span className="text-lg font-bold mr-0.5">₹</span>
                <span className="text-3xl font-black">{listing.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Badges: Verified Student & Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1 text-teal-300">
                <ShieldCheck className="w-4 h-4 text-[#00D2B4]" />
                Verified Student Listing
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Posted on {formattedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                In-Person Campus Handover
              </span>
            </div>
          </div>

          {/* Item Description */}
          <div className="p-4 rounded-2xl bg-[#112233]/70 border border-[#1C334A] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Item Details & Condition
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Seller Contact & Handover Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 to-[#112233] border border-teal-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#00D2B4]" />
                  Contact Seller for Exchange
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Meet safely in public campus areas (Library, Student Center, Cafeteria)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-teal-950 text-[#00D2B4] text-[10px] font-mono font-bold uppercase border border-teal-500/40">
                Verified Seller
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Email Contact CTA */}
              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#172D42] hover:bg-[#1E3A54] border border-teal-500/30 text-white text-xs font-bold transition-all"
                >
                  <Mail className="w-4 h-4 text-[#00D2B4]" />
                  <span>Email: {listing.contactEmail}</span>
                </a>
              )}

              {/* WhatsApp Contact CTA */}
              {listing.contactPhone && (
                <a
                  href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-teal inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-teal"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>WhatsApp Chat</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-[#1C334A] bg-[#09111C]/90 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00D2B4]" />
            Zero transaction fees • Campus Connect peer-to-peer exchange
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#172D42] text-slate-200 hover:text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
