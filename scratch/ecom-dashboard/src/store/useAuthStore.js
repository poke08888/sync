import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: {
    name: 'Admin CEO',
    role: 'ceo', // can be 'ceo', 'brand_manager', 'media_buyer'
    assignedBrand: null, // assigned brand for BM
  },
  globalBrand: 'All Brands', // State for the Global Dropdown
  setRole: (role) => set((state) => {
    // If entering BM mode, auto-assign them to Brand A and lock Global Brand
    const assignedBrand = role === 'brand_manager' ? 'Brand A - Cosmetics' : null;
    const globalBrand = role === 'brand_manager' ? 'Brand A - Cosmetics' : 'All Brands';
    return { 
      user: { ...state.user, role, assignedBrand },
      globalBrand
    };
  }),
  setGlobalBrand: (brand) => set({ globalBrand: brand }),
}))
