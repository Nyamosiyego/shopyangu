import { NextResponse } from 'next/server'
import { MOCK_SHOPS } from '@/app/constants'

export async function GET() {
  return NextResponse.json(MOCK_SHOPS)
}

export async function POST(request: Request) {
  const newShop = await request.json()
  const shop = {
    id: Math.random().toString(36).substr(2, 9),
    productCount: 0,
    ...newShop
  }
  return NextResponse.json(shop)
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 })
  }

  const updates = await request.json()
  return NextResponse.json(updates)
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Shop deleted' })
}