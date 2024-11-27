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
import { 
  MOCK_DASHBOARD_METRICS,
  MOCK_STOCK_STATUS,
  MOCK_TOP_SHOPS
} from './constants'



export default function Dashboard() {
  console.log(MOCK_STOCK_STATUS);
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Shops"
          value={MOCK_DASHBOARD_METRICS.totalShops}
          description="Active shops on platform"
        />
        <MetricCard
          title="Total Products"
          value={MOCK_DASHBOARD_METRICS.totalProducts}
          description="Listed products"
        />
        <MetricCard
          title="Total Value"
          value={`$${MOCK_DASHBOARD_METRICS.totalValue.toLocaleString()}`}
          description="Value of all products"
        />
        <MetricCard
          title="Total Stock"
          value={MOCK_DASHBOARD_METRICS.totalStock}
          description="Items in stock"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Stock Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_STOCK_STATUS}>
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
              <BarChart data={MOCK_TOP_SHOPS} layout="vertical">
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