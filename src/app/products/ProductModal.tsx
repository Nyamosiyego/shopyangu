'use client'

import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Product, Shop } from '@/types'
import { shopsApi } from '../api/shops' 
import { productsApi } from '../api/products' 
import toast from 'react-hot-toast'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    _id: '', // Product ID
    name: '',
    description: '',
    price: '',
    stockLevel: '',
    shopId: ''
  })
  const [shops, setShops] = useState<Shop[]>([])
  const [loadingShops, setLoadingShops] = useState(true)

  // Fetch shops for the dropdown
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await shopsApi.getShops()
        setShops(response.data)
      } catch (error) {
        console.error('Error fetching shops:', error)
        toast.error('Failed to fetch shops')
      } finally {
        setLoadingShops(false)
      }
    }
    fetchShops()
  }, [])

  // Pre-fill form data if editing a product
  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stockLevel: product.stockLevel?.toString() || '',
        shopId: product.shopId
      })
    } else {
      setFormData({
        _id: '',
        name: '',
        description: '',
        price: '',
        stockLevel: '',
        shopId: ''
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formattedData:any = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stockLevel: formData.stockLevel ? parseInt(formData.stockLevel) : undefined,
      shopId: formData.shopId
    }

    try {
      if (formData._id) {
        await productsApi.updateProduct(formData._id, formattedData)
        toast.success('Product updated successfully')
      } else {
        await productsApi.createProduct(formattedData)
        toast.success('Product created successfully')
      }
      onClose()
    } catch (error) {
      console.error('Error submitting product:', error)
      toast.error('Failed to save product')
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-0 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {product ? 'Edit Product' : 'Add New Product'}
                    </Dialog.Title>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Product Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                              Price
                            </label>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                step="0.01"
                                id="price"
                                value={formData.price}
                                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                className="block w-full rounded-md border-gray-300 pl-7 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="stockLevel" className="block text-sm font-medium text-gray-700">
                              Stock Level
                            </label>
                            <input
                              type="number"
                              id="stockLevel"
                              value={formData.stockLevel}
                              onChange={(e) => setFormData(prev => ({ ...prev, stockLevel: e.target.value }))}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="shopId" className="block text-sm font-medium text-gray-700">
                            Shop
                          </label>
                          <select
                            id="shopId"
                            value={formData.shopId}
                            onChange={(e) => setFormData(prev => ({ ...prev, shopId: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="">Select a shop</option>
                            {loadingShops ? (
                              <option disabled>Loading shops...</option>
                            ) : (
                              shops.map((shop) => (
                                <option key={shop._id} value={shop._id}>
                                  {shop.name}
                                </option>
                              ))
                            )}
                          </select>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                          >
                            {product ? 'Update' : 'Create'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 inline-flex w

-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
