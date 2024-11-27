import axios from 'axios'
import { Shop } from '@/types'

export const shopsApi = {
  getShops: () => 
    axios.get<Shop[]>('/api/shops'),
  
  createShop: (shop: Omit<Shop, 'id' | 'productCount'>) => 
    axios.post<Shop>('/api/shops', shop),
  
  updateShop: (id: string, shop: Partial<Shop>) => 
    axios.put<Shop>(`/api/shops?id=${id}`, shop),
  
  deleteShop: (id: string) => 
    axios.delete(`/api/shops?id=${id}`)
}