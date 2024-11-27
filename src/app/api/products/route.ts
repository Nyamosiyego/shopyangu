// app/api/products/route.ts
import { NextResponse } from 'next/server'
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/data-service'

export async function GET() {
  return NextResponse.json(getProducts())
}

export async function POST(request: Request) {
  const product = await request.json()
  const newProduct = addProduct(product)
  return NextResponse.json(newProduct)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  const updates = await request.json()
  const updatedProduct = updateProduct(id, updates)
  return NextResponse.json(updatedProduct)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
  }

  deleteProduct(id)
  return NextResponse.json({ message: 'Product deleted' })
}