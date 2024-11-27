import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Product from '@/models/Product';
import { Types } from 'mongoose';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST create a product
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const productData = await request.json();
    const newProduct = await Product.create(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// PUT update a product
export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  // Validate that the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    const updates = await request.json();
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE remove a product
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  // Validate that the ID is a valid MongoDB ObjectId
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
  }

  try {
    await dbConnect();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}