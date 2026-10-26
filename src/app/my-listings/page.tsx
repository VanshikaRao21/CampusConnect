'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { 
  Layers, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  IndianRupee, 
  ArrowLeft,
  Calendar,
  Check,
  ShieldCheck,
  Tag,
  Sparkles
} from 'lucide-react';
import { Listing } from '../../types/listing';
import { dataClient, authClient } from '../../lib/amplifyClient';
import AuthModal from '../../components/auth/AuthModal';

export default function MyListingsPage() {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ userId: '', email: '', isAuthenticated: false });
  const [authOpen, setAuthOpen] = useState(false);

  // Edit price modal state
  const [editingItem, setEditingItem] = useState<Listing | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  // Delete confirmation modal state
  const [deletingItem, setDeletingItem] = useState<Listing | null>(null);
  const [actionError, setActionError] = useState<string>('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const user = await authClient.restoreSession();
      setCurrentUser(user);
      if (!user.isAuthenticated || !user.userId) { setMyListings([]); return; }
      setMyListings(await dataClient.getListingsByOwner(user.userId));
    } catch (err: any) {
      setActionError(err.message || 'Failed to load personal listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('campusconnect_data_updated', loadData);
    return () => window.removeEventListener('campusconnect_data_updated', loadData);
  }, []);

  const handleToggleSold = async (item: Listing) => {
    try {
      if (!currentUser.isAuthenticated || item.owner !== currentUser.userId) throw new Error('You can only change listings owned by your account.');
      const nextStatus = item.status === 'SOLD' ? 'ACTIVE' : 'SOLD';
      await dataClient.updateListing(item.id, { status: nextStatus }, currentUser.userId);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (!currentUser.isAuthenticated || editingItem.owner !== currentUser.userId) { setActionError('You can only edit listings owned by your account.'); return; }
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed < 0) {
      setActionError('Please provide a valid non-negative price');
      return;
    }

    try {
      await dataClient.updateListing(editingItem.id, { price: parsed }, currentUser.userId);
      setEditingItem(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    if (!currentUser.isAuthenticated || deletingItem.owner !== currentUser.userId) { setActionError('You can only delete listings owned by your account.'); return; }
    try {
      await dataClient.deleteListing(deletingItem.id, currentUser.userId);
      setDeletingItem(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1320] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C334A] pb-6 mb-8">
          <div>
            <NextLink
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#00D2B4] transition-colors mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Marketplace</span>
            </NextLink>
            <div className="flex items-center gap-2 text-[#00D2B4] text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Authenticated Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Campus Listings
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Manage your items, adjust prices, toggle sold status, or delete listings directly from AWS DynamoDB.
            </p>
          </div>

          <NextLink
            href="/create-listing"
            className="btn-teal inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-teal self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Listing</span>
          </NextLink>
        </div>

        {/* Error alert */}
        {actionError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-center justify-between">
            <span>{actionError}</span>
            <button onClick={() => setActionError('')} className="text-red-400 font-bold ml-2">
              ×
            </button>
          </div>
        )}

        {!currentUser.isAuthenticated && !isLoading ? (
          <div className="glass-panel rounded-3xl p-8 sm:p-16 text-center border border-teal-500/25">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-[#00D2B4]" />
            <h2 className="text-xl font-bold text-white">Sign in to manage your listings</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              Your dashboard is private to your student account. Sign in with Amazon Cognito to continue.
            </p>
            <NextLink
              href="/login"
              className="btn-teal mt-5 inline-block rounded-xl px-5 py-2.5 text-xs font-bold shadow-teal"
            >
              Student Sign In
            </NextLink>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-[#112233]/70 rounded-2xl animate-pulse border border-[#1C334A]" />
            ))}
          </div>
        ) : myListings.length === 0 ? (
          <div className="glass-panel py-16 text-center rounded-3xl border border-dashed border-[#1C334A] p-8">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">You haven't listed any items yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              Have old semester textbooks, drafters, or calculators sitting in your dorm? Turn them into cash.
            </p>
            <NextLink
              href="/create-listing"
              className="btn-teal inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-teal"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create First Listing</span>
            </NextLink>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((item) => {
              const isSold = item.status === 'SOLD';
              return (
                <div
                  key={item.id}
                  className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Image + Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-[#1C334A]">
                      <img
                        src={item.imagePath}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-teal-950/80 text-[#00D2B4] border border-teal-500/30">
                          {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          isSold ? 'bg-red-950/80 text-red-300 border-red-500/30' : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="font-bold text-[#00D2B4] text-sm">₹{item.price}</span>
                        <span>•</span>
                        <span>Condition: {item.condition}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px] text-slate-500">ID: {item.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#1C334A]">
                    {/* Toggle Sold */}
                    <button
                      onClick={() => handleToggleSold(item)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                        isSold
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSold ? 'Mark Available' : 'Mark as Sold'}</span>
                    </button>

                    {/* Edit Price */}
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setNewPrice(item.price.toString());
                      }}
                      className="p-2 rounded-xl text-slate-300 hover:text-[#00D2B4] hover:bg-[#172D42] border border-[#1C334A] transition-colors"
                      title="Edit Price"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-red-950/60 border border-[#1C334A] transition-colors"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Edit Price Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="glass-panel rounded-3xl p-6 max-w-sm w-full border border-teal-500/30 space-y-4">
              <h3 className="font-bold text-lg text-white">Update Listing Price</h3>
              <p className="text-xs text-slate-400">
                Editing: <strong className="text-white">{editingItem.title}</strong>
              </p>
              <form onSubmit={handleSavePrice} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00D2B4] font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-[#09111C] border border-[#1C334A] rounded-xl text-sm font-bold text-white focus:outline-none focus:border-[#00D2B4]"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-teal px-4 py-2 rounded-xl text-xs font-bold shadow-teal"
                  >
                    Save to DynamoDB
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="glass-panel rounded-3xl p-6 max-w-md w-full border border-red-500/30 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Confirm Deletion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to permanently delete <strong className="text-white">"{deletingItem.title}"</strong>? This will delete the record from Amazon DynamoDB and cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#172D42] border border-[#1C334A]"
                >
                  Keep Item
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
                >
                  Delete from DynamoDB
                </button>
              </div>
            </div>
          </div>
        )}

        {authOpen && <AuthModal onClose={() => { setAuthOpen(false); loadData(); }} />}
      </div>
    </div>
  );
}
