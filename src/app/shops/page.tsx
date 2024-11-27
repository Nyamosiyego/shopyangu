'use client'

import { useEffect, useState } from 'react'
import useStore from '../store'
import Image from 'next/image'
import { Plus, Trash2, Search, Edit } from 'lucide-react'
import ShopModal from './ShopModal' // Import the existing modal
import { Shop } from '@/types'

export default function ShopsPage() {
  const { 
    shops, 
    loading, 
    error, 
    fetchShops, 
    deleteShop,
    searchQuery,
    currentPage,
    itemsPerPage,
    setSearchQuery,
    setCurrentPage
  } = useStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  useEffect(() => {
    fetchShops().catch(console.error)
  }, [fetchShops])

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
    </div>
  )

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      Error: {error}
    </div>
  )

  // Filter shops based on search query
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedShops = filteredShops.slice(startIndex, startIndex + itemsPerPage)

  const handleDelete = async (id: string) => {
    try {
      await deleteShop(id)
    } catch (error) {
      console.error('Failed to delete shop:', error)
    }
  }

  const openCreateModal = () => {
    setSelectedShop(null)
    setIsModalOpen(true)
  }

  const openEditModal = (shop: Shop) => {
    setSelectedShop(shop)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Shops</h1>
        <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Product
          </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search shops..."
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {filteredShops.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">No Shops Found</h2>
          <p className="text-gray-500 mb-6">
            You haven't created any shops yet. Click the "Add Shop" button to get started.
          </p>
          <button 
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Create Your First Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedShops.map(shop => (
            <div 
              key={shop._id} 
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {shop.logo ? (
                    <Image 
                      width={50} 
                      height={50} 
                      src={shop.logo} 
                      alt={shop.name} 
                      className="rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full mr-4 flex items-center justify-center">
                      <span className="text-gray-500">{shop.name[0]}</span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold">{shop.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{shop.description || 'No description'}</p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">
                    Products: {shop.productCount}
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(shop)}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => handleDelete(shop._id)}
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Shop Modal */}
      <ShopModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        shop={selectedShop}
      />
    </div>
  )
}