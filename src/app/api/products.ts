import axios from 'axios'
import { Product } from '@/types'

export const productsApi = {
  getProducts: () => 
    axios.get<Product[]>('/api/products'),
  
  createProduct: (product: Omit<Product, 'id'>) => 
    axios.post<Product>('/api/products', product),
  
  updateProduct: (id: string, product: Partial<Product>) => 
    axios.put<Product>(`/api/products?id=${id}`, product),
  
  deleteProduct: (id: string) => 
    axios.delete(`/api/products?id=${id}`)
}