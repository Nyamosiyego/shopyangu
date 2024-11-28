// lib/data-service.ts
import fs from 'fs'
import path from 'path'
import { Shop, Product } from '@/types'

const SHOPS_FILE = path.join(process.cwd(), 'data', 'shops.json')
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

// Helper functions
const ensureDirectoryExists = () => {
  const dirPath = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// Shop operations
export const getShops = (): Shop[] => {
  if (!fs.existsSync(SHOPS_FILE)) {
    return []
  }
  const data = fs.readFileSync(SHOPS_FILE, 'utf-8')
  return JSON.parse(data).shops
}

export const setShops = (shops: Shop[]) => {
  ensureDirectoryExists()
  fs.writeFileSync(SHOPS_FILE, JSON.stringify({ shops }, null, 2))
}

// Product operations
export const getProducts = (): Product[] => {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    return []
  }
  const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8')
  return JSON.parse(data).products
}

export const setProducts = (products: Product[]) => {
  ensureDirectoryExists()
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify({ products }, null, 2))
}

// Metrics calculations
export const getDashboardMetrics = () => {
  const shops = getShops()
  const products = getProducts()

  return {
    totalShops: shops.length,
    totalProducts: shops.reduce((acc, shop) => acc + shop.productCount, 0),
    totalValue: products.reduce((acc, product) => acc + (product.price * product.stockLevel), 0),
    totalStock: products.reduce((acc, product) => acc + product.stockLevel, 0)
  }
}

export const getStockStatus = () => {
  const products = getProducts()
  
  return [
    {
      name: 'In Stock',
      value: products.filter(product => product.stockLevel > 5).length
    },
    {
      name: 'Low Stock',
      value: products.filter(product => product.stockLevel > 0 && product.stockLevel <= 5).length
    },
    {
      name: 'Out of Stock',
      value: products.filter(product => product.stockLevel === 0).length
    }
  ]
}

export const getTopShops = () => {
  const shops = getShops()
  const products = getProducts()

  return shops.map(shop => ({
    name: shop.name,
    stock: products
      .filter(product => product.shopId === shop._id)
      .reduce((acc, product) => acc + product.stockLevel, 0)
  }))
  .sort((a, b) => b.stock - a.stock)
  .slice(0, 5)
}

// CRUD operations for products
export const addProduct = (product: Omit<Product, 'id'>) => {
  const products = getProducts()
  const newProduct = {
    ...product,
    id: Math.random().toString(36).substr(2, 9)
  }
  setProducts([...products, newProduct])
  return newProduct
}

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const products = getProducts()
  const updatedProducts = products.map(product =>
    product._id === id ? { ...product, ...updates } : product
  )
  setProducts(updatedProducts)
  return updatedProducts.find(p => p._id === id)
}

export const deleteProduct = (id: string) => {
  const products = getProducts()
  const filteredProducts = products.filter(product => product._id !== id)
  setProducts(filteredProducts)
}