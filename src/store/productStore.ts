import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  searchTerm: string;
  categoryFilter: string;
  lowStockOnly: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: string) => void;
  setLowStockOnly: (lowStock: boolean) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  isLoading: false,
  error: null,
  searchTerm: '',
  categoryFilter: '',
  lowStockOnly: false,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;

      set({ 
        products: data as Product[], 
        filteredProducts: data as Product[],
        isLoading: false 
      });
      
      // Apply any existing filters
      get().setSearchTerm(get().searchTerm);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();

      if (error) throw error;

      const newProduct = data[0] as Product;
      
      set(state => ({
        products: [...state.products, newProduct],
        isLoading: false
      }));
      
      // Re-apply filters
      get().setSearchTerm(get().searchTerm);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      set(state => {
        const updatedProducts = state.products.map(product => 
          product.id === id ? { ...product, ...updates } : product
        );
        
        return { 
          products: updatedProducts,
          isLoading: false 
        };
      });
      
      // Re-apply filters
      get().setSearchTerm(get().searchTerm);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateStock: async (id, quantity) => {
    try {
      const product = get().products.find(p => p.id === id);
      if (!product) return;

      const newQuantity = product.stock_quantity + quantity;
      if (newQuantity < 0) throw new Error('Cannot reduce stock below zero');

      await get().updateProduct(id, { stock_quantity: newQuantity });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setSearchTerm: (term) => {
    const { products, categoryFilter, lowStockOnly } = get();
    
    let filtered = [...products];
    
    // Apply search term filter
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowerTerm) || 
        product.description.toLowerCase().includes(lowerTerm)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category === categoryFilter
      );
    }
    
    // Apply low stock filter
    if (lowStockOnly) {
      filtered = filtered.filter(product => 
        product.stock_quantity <= product.low_stock_threshold
      );
    }
    
    set({ 
      searchTerm: term,
      filteredProducts: filtered
    });
  },

  setCategoryFilter: (category) => {
    set({ categoryFilter: category });
    // Re-apply search with new category filter
    get().setSearchTerm(get().searchTerm);
  },

  setLowStockOnly: (lowStock) => {
    set({ lowStockOnly: lowStock });
    // Re-apply search with new low stock filter
    get().setSearchTerm(get().searchTerm);
  }
}));