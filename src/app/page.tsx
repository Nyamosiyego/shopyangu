'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useEffect, useState } from 'react'
import { productsApi } from './api/products' 
import { shopsApi } from './api/shops' 
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalShops: 0,
    totalProducts: 0,
    totalValue: 0,
    totalStock: 0
  })
  const [stockStatus, setStockStatus] = useState([])
  const [topShops, setTopShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products and shops data
        const [productsResponse, shopsResponse] = await Promise.all([
          productsApi.getProducts(),
          shopsApi.getShops()
        ])

        const products = productsResponse.data
        const shops = shopsResponse.data

        // Calculate metrics
        const totalProducts = products.length
        const totalValue = products.reduce((sum, product) => sum + product.price * product.stockLevel, 0)
        const totalStock = products.reduce((sum, product) => sum + product.stockLevel, 0)
        const totalShops = shops.length

        // Aggregate stock status
        const stockStatusData:any = products.reduce<{ name: string; value: number }[]>((acc, product) => {
          let status: string;
          if (product.stockLevel > 5) {
            status = 'In Stock';
          } else if (product.stockLevel === 0) {
            status = 'Out of Stock';
          } else {
            status = 'Low Stock';
          }
          
          const existing = acc.find(item => item.name === status);
          
          if (existing) {
            existing.value += 1;
          } else {
            acc.push({ name: status, value: 1 });
          }
          
          return acc;
        }, []);

        // Determine top shops by stock level
        const shopStockLevels = shops.map(shop => ({
          name: shop.name,
          stock: products
            .filter(product => product.shopId === shop._id)
            .reduce((sum, product) => sum + product.stockLevel, 0)
        }))
        const topShopsData:any = shopStockLevels
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 5)

        setMetrics({ totalShops, totalProducts, totalValue, totalStock })
        setStockStatus(stockStatusData)
        setTopShops(topShopsData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Shops"
          value={metrics.totalShops}
          description="Active shops on platform"
        />
        <MetricCard
          title="Total Products"
          value={metrics.totalProducts}
          description="Listed products"
        />
        <MetricCard
          title="Total Value"
          value={`$${metrics.totalValue.toLocaleString()}`}
          description="Value of all products"
        />
        <MetricCard
          title="Total Stock"
          value={metrics.totalStock}
          description="Items in stock"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Stock Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top 5 Shops by Stock Level</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topShops} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Bar dataKey="stock" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, description }: {
  title: string
  value: string | number
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  )
}
