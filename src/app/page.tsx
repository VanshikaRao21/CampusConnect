'use client';

import React, { useState, useEffect, useMemo } from 'react';
import HeroSection from '../components/marketplace/HeroSection';
import CategoryBar from '../components/marketplace/CategoryBar';
import SearchAndFilterBar from '../components/marketplace/SearchAndFilterBar';
import ListingGrid from '../components/marketplace/ListingGrid';
import ListingDetailModal from '../components/marketplace/ListingDetailModal';
import HowItWorks from '../components/marketplace/HowItWorks';
import DemoControlBar from '../components/marketplace/DemoControlBar';
import { Listing, FilterState } from '../types/listing';
import { dataClient } from '../lib/amplifyClient';

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: '',
    condition: '',
    minPrice: 0,
    maxPrice: 2500,
    sortBy: 'newest',
  });

  // Fetch listings from AWS DynamoDB / dataClient
  const loadListings = async () => {
    try {
      setIsLoading(true);
      const data = await dataClient.getListings();
      setListings(data);
    } catch (err) {
      console.error('Failed to load listings from DynamoDB', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();

    // Listen for reactive updates from any tab or modal mutation
    const handleDataChange = () => {
      loadListings();
    };

    window.addEventListener('campusconnect_data_updated', handleDataChange);
    return () => window.removeEventListener('campusconnect_data_updated', handleDataChange);
  }, []);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      category: '',
      condition: '',
      minPrice: 0,
      maxPrice: 2500,
      sortBy: 'newest',
    });
  };

  const handleResetSeedData = async () => {
    await dataClient.resetToSeedData();
    await loadListings();
  };

  // Multi-dimensional filtering & sorting logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        // Search query match
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesCat = item.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesCat) return false;
        }

        // Category filter
        if (filters.category && item.category !== filters.category) {
          return false;
        }

        // Condition filter
        if (filters.condition && item.condition !== filters.condition) {
          return false;
        }

        // Price range filter
        if (item.price > filters.maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (filters.sortBy === 'price-desc') {
          return b.price - a.price;
        }
        // Default: newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, filters]);

  return (
    <div>
      {/* Hero Section with Search */}
      <HeroSection
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
      />

      {/* Category Navigation Bar */}
      <CategoryBar
        selectedCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
      />

      {/* Main Marketplace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Live Cloud Demo Status Bar */}
        <DemoControlBar
          onResetSeed={handleResetSeedData}
          count={listings.length}
        />

        {/* Search, Filter, Sort Controls */}
        <SearchAndFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredListings.length}
        />

        {/* Listings Grid */}
        <ListingGrid
          listings={filteredListings}
          isLoading={isLoading}
          onSelectListing={(item) => setSelectedListing(item)}
          onResetFilters={handleResetFilters}
        />

        {/* How It Works Explainer */}
        <HowItWorks />

      </div>

      {/* Listing Detail Modal */}
      <ListingDetailModal
        listing={selectedListing}
        onClose={() => setSelectedListing(null)}
      />
    </div>
  );
}
