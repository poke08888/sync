"use client";

import React from 'react';
import DashboardFilters from './DashboardFilters';
import { useFilters } from '@/context/FilterContext';

export default function GlobalFilters() {
  const { 
    selectedBrand, setSelectedBrand, 
    timeRange, setTimeRange, 
    customRange, setCustomRange 
  } = useFilters();

  return (
    <DashboardFilters 
      selectedBrand={selectedBrand}
      onBrandChange={setSelectedBrand}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      customRange={customRange}
      onCustomRangeChange={setCustomRange}
    />
  );
}
