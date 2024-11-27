import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stockLevel: { type: Number, required: true },
  shopId: { type: String, required: true },
}, { timestamps: true });

const Product = models.Product || model('Product', ProductSchema);

export default Product;
