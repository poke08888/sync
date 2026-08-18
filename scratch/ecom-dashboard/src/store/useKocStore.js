import { create } from 'zustand';
import { aggregateByKoc, computeKpis } from '../utils/kocExcelParser';

const getPreviousPeriodDates = (startStr, endStr) => {
  if (!startStr && !endStr) return { start: '', end: '' };
  
  const start = startStr ? new Date(startStr) : new Date(endStr);
  const end = endStr ? new Date(endStr) : new Date(startStr);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  const prevEnd = new Date(start);
  prevEnd.setDate(prevEnd.getDate() - 1);
  
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - diffDays + 1);
  
  const fmt = (d) => {
      const offset = d.getTimezoneOffset();
      const localDay = new Date(d.getTime() - (offset*60*1000));
      return localDay.toISOString().split('T')[0];
  };
  
  return { start: fmt(prevStart), end: fmt(prevEnd) };
};

const applyFiltersAndSet = (baseRows, dateObj, brand, setFn, extraState = {}) => {
  const state = extraState.originalRawLives ? extraState : {}; // fallbacks for store state
  
  let filteredRows = baseRows;
  let prevFilteredRows = [];
  
  // 1. Filter by Brand
  if (brand && brand !== 'all') {
    filteredRows = filteredRows.filter(r => r.brand === brand);
  }

  // 2. Filter by Date
  if (dateObj.start || dateObj.end) {
    filteredRows = filteredRows.filter(live => {
      if (!live.date || live.date === 'Unknown') return true;
      let pass = true;
      if (dateObj.start) pass = pass && live.date >= dateObj.start;
      if (dateObj.end) pass = pass && live.date <= dateObj.end;
      return pass;
    });
    
    // Period Over Period (Must also respect brand)
    const prevDates = getPreviousPeriodDates(dateObj.start, dateObj.end);
    let popSource = baseRows;
    if (brand && brand !== 'all') {
      popSource = popSource.filter(r => r.brand === brand);
    }

    prevFilteredRows = popSource.filter(live => {
      if (!live.date || live.date === 'Unknown') return false;
      let pass = true;
      if (prevDates.start) pass = pass && live.date >= prevDates.start;
      if (prevDates.end) pass = pass && live.date <= prevDates.end;
      return pass;
    });
  } else if (brand && brand !== 'all') {
    // If no date filter but has brand filter, prev is just zero
    prevFilteredRows = [];
  }

  setFn({
    ...extraState,
    globalFilterDate: dateObj,
    selectedBrand: brand,
    rawLives: filteredRows,
    kocList: aggregateByKoc(filteredRows),
    globalMetrics: computeKpis(filteredRows),
    previousGlobalMetrics: computeKpis(prevFilteredRows),
    previousKocList: aggregateByKoc(prevFilteredRows)
  });
};

export const useKocStore = create((set, get) => ({
  isParsed: false,
  viewMode: 'overview', // 'overview' | 'history'
  originalRawLives: [],
  rawLives: [],
  kocList: [],
  globalMetrics: {},
  previousKocList: [],
  previousGlobalMetrics: {},
  selectedKoc: null,
  brands: [],
  selectedBrand: 'all',
  filesUploaded: [], 
  dateRange: '', // global text range display string
  globalFilterDate: { start: '', end: '' }, // numeric range filter shared globally

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedBrand: (brand) => {
    const state = get();
    applyFiltersAndSet(state.originalRawLives, state.globalFilterDate, brand, set);
  },
  setGlobalFilterDate: (dateObj) => {
    const state = get();
    applyFiltersAndSet(state.originalRawLives, dateObj, state.selectedBrand, set);
  },

  appendData: (newRows, fileName, fileDateRange, brandName) => {
    const state = get();
    // inject sourceFile and brand to track mapping
    const stampedRows = newRows.map(r => ({ ...r, sourceFile: fileName, brand: brandName }));
    const combinedRows = [...state.originalRawLives, ...stampedRows];
    
    const allDates = combinedRows.map(r => r.date).filter(d => d && d !== 'Unknown').sort();
    const globalDateRange = allDates.length > 0 
      ? `${allDates[0]} ~ ${allDates[allDates.length - 1]}`
      : fileDateRange;

    const files = [...state.filesUploaded, {
      name: fileName,
      dateRange: fileDateRange,
      sessions: newRows.length,
      brand: brandName
    }];

    const uniqueBrands = Array.from(new Set(combinedRows.map(r => r.brand).filter(Boolean)));

    applyFiltersAndSet(combinedRows, state.globalFilterDate, state.selectedBrand, set, {
      isParsed: true,
      originalRawLives: combinedRows,
      filesUploaded: files,
      dateRange: globalDateRange,
      brands: uniqueBrands
    });
  },

  removeFile: (fileName) => {
    const state = get();
    const newFiles = state.filesUploaded.filter(f => f.name !== fileName);
    if (newFiles.length === 0) {
      // If deleted everything, fallback to global reset
      state.resetData();
      return;
    }

    const baseRows = state.originalRawLives.filter(r => r.sourceFile !== fileName);
    const allDates = baseRows.map(r => r.date).filter(d => d && d !== 'Unknown').sort();
    const globalDateRange = allDates.length > 0 
      ? `${allDates[0]} ~ ${allDates[allDates.length - 1]}`
      : '';

    const uniqueBrands = Array.from(new Set(baseRows.map(r => r.brand).filter(Boolean)));

    applyFiltersAndSet(baseRows, state.globalFilterDate, state.selectedBrand, set, {
      originalRawLives: baseRows,
      filesUploaded: newFiles,
      dateRange: globalDateRange,
      brands: uniqueBrands
    });
  },

  setSelectedKoc: (koc) => set({ selectedKoc: koc }),

  resetData: () => set({
    isParsed: false,
    originalRawLives: [],
    rawLives: [],
    kocList: [],
    globalMetrics: {},
    previousKocList: [],
    previousGlobalMetrics: {},
    selectedKoc: null,
    brands: [],
    selectedBrand: 'all',
    filesUploaded: [],
    dateRange: '',
    globalFilterDate: { start: '', end: '' }
  })
}));
