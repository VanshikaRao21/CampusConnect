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
  Tag
} from 'lucide-react';
import { Listing } from '../../types/listing';
import { dataClient, authClient } from '../../lib/amplifyClient';

export default function MyListingsPage() {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({ userId: '', email: '', isAuthenticated: true });

  // Edit price modal state
  const [editingItem, setEditingItem] = useState<Listing | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  // Delete confirmation modal state
  const [deletingItem, setDeletingItem] = useState<Listing | null>(null);
  const [actionError, setActionError] = useState<string>('');

  const loadData = async () => {
    try {
      setIsLoading(true);
      const user = authClient.getCurrentUser();
      setCurrentUser(user);

      const all = await dataClient.getListings();
      // Filter for items owned by this student
      const mine = all.filter((item) => item.owner === user.userId || item.owner.startsWith('user_student_'));
      setMyListings(mine);
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
      const nextStatus = item.status === 'SOLD' ? 'ACTIVE' : 'SOLD';
      await dataClient.updateListing(item.id, { status: nextStatus }, item.owner);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed < 0) {
      setActionError('Please provide a valid non-negative price');
      return;
    }

    try {
      await dataClient.updateListing(editingItem.id, { price: parsed }, editingItem.owner);
      setEditingItem(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;
    try {
      await dataClient.deleteListing(deletingItem.id, deletingItem.owner);
      setDeletingItem(null);
      await loadData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-violet-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Authenticated Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Campus Listings
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your items, adjust prices, toggle sold status, or delete listings directly from AWS DynamoDB.
          </p>
        </div>

        <NextLink
          href="/create-listing"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-sm shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Listing</span>
        </NextLink>
      </div>

      {/* Error alert */}
      {actionError && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center justify-between">
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} className="text-red-800 font-bold ml-2">
            ×
          </button>
        </div>
      )}

      {/* Listings Table / Cards */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : myListings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 p-8">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">You haven't listed any items yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Have old semester textbooks, drafters, or calculators sitting in your dorm? Turn them into cash.
          </p>
          <NextLink
            href="/create-listing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-xs hover:bg-blue-700 transition-colors"
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
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                {/* Image + Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
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
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isSold ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-1">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="font-bold text-blue-600 text-sm">₹{item.price}</span>
                      <span>•</span>
                      <span>Condition: {item.condition}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px] text-slate-400">ID: {item.id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Toggle Sold */}
                  <button
                    onClick={() => handleToggleSold(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      isSold
                        ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
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
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-colors"
                    title="Edit Price"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeletingItem(item)}
                    className="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Update Listing Price</h3>
            <p className="text-xs text-slate-500">
              Editing: <strong className="text-slate-800">{editingItem.title}</strong>
            </p>
            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-800">"{deletingItem.title}"</strong>? This will remove the record from Amazon DynamoDB and cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
              >
                Keep Item
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 shadow-xs"
              >
                Delete from DynamoDB
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
