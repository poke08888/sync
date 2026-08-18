"use client";

import React, { useState } from 'react';
import KpiDashboard from '../components/metrics/KpiDashboard';
import KpiTracker from '../components/metrics/KpiTracker';
import HourlySalesChart from '../components/charts/HourlySalesChart';
import DailySalesChart from '../components/charts/DailySalesChart';
import PlatformDistributionChart from '../components/charts/PlatformDistributionChart';
import TopProductsChart from '../components/charts/TopProductsChart';
import DashboardFilters from '../components/layout/DashboardFilters';
import { TimeRangeId } from '@/lib/constants';
import { useFilters } from '@/context/FilterContext';

export default function Home() {
  const { selectedBrand, timeRange, customRange } = useFilters();

  return (
    <div className="flex flex-col pb-20">
      <div className="flex flex-col gap-10">
        {/* 1. Main KPI Cards */}
        <section>
          <KpiDashboard selectedBrand={selectedBrand} timeRange={timeRange} />
        </section>

        {/* 2. KPI Tracker & Progress */}
        <section>
          <KpiTracker selectedBrand={selectedBrand} timeRange={timeRange} />
        </section>

        {/* 3. Core Analytics Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel min-h-[450px]">
            <HourlySalesChart brand={selectedBrand} />
          </div>
          <div className="glass-panel min-h-[450px]">
            <DailySalesChart brand={selectedBrand} />
          </div>
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="glass-panel min-h-[480px] xl:col-span-1">
            <PlatformDistributionChart brand={selectedBrand} />
          </div>
          <div className="glass-panel min-h-[480px] xl:col-span-2">
            <TopProductsChart brand={selectedBrand} />
          </div>
        </section>
      </div>
    </div>
  );
}
