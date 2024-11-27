// store/index.ts
import { create } from 'zustand'
import { Product, Shop } from '@/types'
import { shopsApi } from '@/app/api/shops'
import { productsApi } from '@/app/api/products'

interface StoreState {
  products: Product[]
  shops: Shop[]
  loading: boolean
  error: string | null
  searchQuery: string
  selectedShop: string
  currentPage: number
  itemsPerPage: number
  
  // Async actions
  fetchShops: () => Promise<void>
  fetchProducts: () => Promise<void>
  addShop: (shop: Omit<Shop, 'id' | 'productCount'>) => Promise<void>
  updateShop: (id: string, shop: Partial<Shop>) => Promise<void>
  deleteShop: (id: string) => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  
  // Sync actions
  setSearchQuery: (query: string) => void
  setSelectedShop: (shopId: string) => void
  setCurrentPage: (page: number) => void
  setItemsPerPage: (items: number) => void
  clearError: () => void
}

const useStore = create<StoreState>((set) => ({
  products: [],
  shops: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedShop: 'all',
  currentPage: 1,
  itemsPerPage: 10,

  fetchShops: async () => {
    set({ loading: true, error: null })
    try {
      const response = await shopsApi.getShops()
      set({ shops: response.data })
    } catch (error) {
      set({ error: 'Failed to fetch shops' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await productsApi.getProducts()
      set({ products: response.data })
    } catch (error) {
      set({ error: 'Failed to fetch products' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  addShop: async (shop) => {
    set({ loading: true, error: null })
    try {
      const response = await shopsApi.createShop(shop)
      set(state => ({ 
        shops: [...state.shops, response.data],
        currentPage: 1 // Reset to first page when adding new shop
      }))
    } catch (error) {
      set({ error: 'Failed to add shop' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateShop: async (id, shop) => {
    set({ loading: true, error: null })
    try {
      const response = await shopsApi.updateShop(id, shop)
      set(state => ({
        shops: state.shops.map(s => 
          s._id === id ? response.data : s
        )
      }))
    } catch (error) {
      set({ error: 'Failed to update shop' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteShop: async (id) => {
    set({ loading: true, error: null })
    try {
      await shopsApi.deleteShop(id)
      set(state => ({
        shops: state.shops.filter(s => s._id !== id),
        // Reset selected shop if deleted shop was selected
        selectedShop: state.selectedShop === id ? 'all' : state.selectedShop,
        // Reset to first page if current page becomes empty
        currentPage: 1
      }))
    } catch (error) {
      set({ error: 'Failed to delete shop' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  addProduct: async (product) => {
    set({ loading: true, error: null })
    try {
      const response = await productsApi.createProduct(product)
      set(state => ({ 
        products: [...state.products, response.data],
        currentPage: 1
      }))
    } catch (error) {
      set({ error: 'Failed to add product' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  updateProduct: async (id, product) => {
    set({ loading: true, error: null })
    try {
      const response = await productsApi.updateProduct(id, product)
      set(state => ({
        products: state.products.map(p => 
          p._id === id ? response.data : p
        )
      }))
    } catch (error) {
      set({ error: 'Failed to update product' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      await productsApi.deleteProduct(id)
      set(state => ({
        products: state.products.filter(p => p._id !== id),
        currentPage: 1
      }))
    } catch (error) {
      set({ error: 'Failed to delete product' })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  // Sync actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedShop: (shopId) => set({ selectedShop: shopId, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
  clearError: () => set({ error: null })
}))

export default useStore