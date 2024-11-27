// app/shops/page.tsx
'use client'

import { useEffect } from 'react'
import useStore from '../store'

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

  useEffect(() => {
    fetchShops().catch(console.error)
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

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

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search shops..."
      />

      <div className="shops-grid">
        {paginatedShops.map(shop => (
          <div key={shop.id} className="shop-card">
            <h3>{shop.name}</h3>
            <p>{shop.description}</p>
            <img src={shop.logo} alt={shop.name} />
            <p>Products: {shop.productCount}</p>
            <button onClick={() => handleDelete(shop.id)}>Delete</button>
            {/* Add edit button and functionality */}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}