import mongoose from 'mongoose';

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

let cached:any = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;