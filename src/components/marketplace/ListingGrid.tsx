'use client';

import React from 'react';
import { Listing } from '../../types/listing';
import ListingCard from './ListingCard';
import ListingSkeleton from './ListingSkeleton';
import EmptyState from './EmptyState';

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  onSelectListing: (listing: Listing) => void;
  onResetFilters: () => void;
}

export default function ListingGrid({
  listings,
  isLoading,
  onSelectListing,
  onResetFilters,
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return <EmptyState onReset={onResetFilters} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {listings.map((item) => (
        <ListingCard
          key={item.id}
          listing={item}
          onSelect={onSelectListing}
        />
      ))}
    </div>
  );
}
