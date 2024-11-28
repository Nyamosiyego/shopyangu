// app/components/Navigation.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ShoppingBagIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Shops', href: '/shops', icon: BuildingStorefrontIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

export default function Navigation() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [sidebarOpen])

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="fixed top-0 left-0 right-0 z-20 flex h-16 flex-shrink-0 bg-white shadow">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar and Overlay */}
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar Panel */}
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white">
              <div className="flex h-full flex-col">
                {/* Sidebar Header */}
                <div className="flex h-16 items-center justify-between px-4">
                  <span className="text-2xl font-semibold">Store Admin</span>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 px-2 py-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`
                          group flex items-center rounded-md px-2 py-2 text-sm font-medium
                          ${isActive
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <item.icon
                          className={`
                            mr-3 h-6 w-6 flex-shrink-0
                            ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}
                          `}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <span className="text-2xl font-semibold">Store Admin</span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center rounded-md px-2 py-2 text-sm font-medium
                      ${isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 h-6 w-6 flex-shrink-0
                        ${isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content Padding for Mobile */}
      <div className="lg:hidden h-16" />
    </>
  )
}