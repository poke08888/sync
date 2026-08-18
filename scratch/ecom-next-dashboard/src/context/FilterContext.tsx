"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BRANDS, TimeRangeId } from '@/lib/constants';

interface FilterContextType {
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;
  timeRange: TimeRangeId;
  setTimeRange: (range: TimeRangeId) => void;
  customRange: { start: string; end: string };
  setCustomRange: (range: { start: string; end: string }) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [timeRange, setTimeRange] = useState<TimeRangeId>('7days');
  const [customRange, setCustomRange] = useState({ 
    start: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });

  return (
    <FilterContext.Provider value={{
      selectedBrand, setSelectedBrand,
      timeRange, setTimeRange,
      customRange, setCustomRange
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
}
