import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Shop from '@/models/Shop';

// GET all shops
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const shops = await Shop.find({});
    return NextResponse.json(shops);
  } catch (error) {
    console.error('Fetch shops error:', error);
    return NextResponse.json({ error: 'Failed to fetch shops' }, { status: 500 });
  }
}

// POST create a shop
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const shopData = await request.json();
    
    const newShop = await Shop.create({
      ...shopData,
      productCount: 0
    });

    return NextResponse.json(newShop, { status: 201 });
  } catch (error) {
    console.error('Create shop error:', error);
    return NextResponse.json({ error: 'Failed to create shop' }, { status: 500 });
  }
}

// PUT update a shop
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updates = await request.json();
    const updatedShop = await Shop.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json(updatedShop);
  } catch (error) {
    console.error('Update shop error:', error);
    return NextResponse.json({ error: 'Failed to update shop' }, { status: 500 });
  }
}

// DELETE remove a shop
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedShop = await Shop.findByIdAndDelete(id);

    if (!deletedShop) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Shop deleted' });
  } catch (error) {
    console.error('Delete shop error:', error);
    return NextResponse.json({ error: 'Failed to delete shop' }, { status: 500 });
  }
}