import type { Metadata } from "next";
import "./globals.css";




export const metadata: Metadata = {
  title: "ShopYangu",
  description: "ShopYangu Admin",
};



// app/layout.tsx
import { Inter } from 'next/font/google'
import Navigation from "@/components/Navigation";
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full">
          <Navigation />
          <div className="lg:pl-64 flex flex-col flex-1">
            <main className="flex-1 py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}