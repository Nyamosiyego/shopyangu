import mongoose, { Schema, model, models } from 'mongoose';

const ShopSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  productCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const Shop = models.Shop || model('Shop', ShopSchema);

export default Shop;