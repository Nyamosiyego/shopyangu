import { Shop, Product } from '@/types'

export const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Electronics Hub',
    description: 'Premium electronics and gadgets',
    logo: '/shop-1.png',
    productCount: 45
  },
  {
    id: '2',
    name: 'Fashion Square',
    description: 'Trendy fashion and accessories',
    logo: '/shop-2.png',
    productCount: 32
  },
  {
    id: '3',
    name: 'Home Essentials',
    description: 'Everything for your home',
    logo: '/shop-3.png',
    productCount: 28
  },
  {
    id: '4',
    name: 'Sports Center',
    description: 'Sports equipment and gear',
    logo: '/shop-4.png',
    productCount: 37
  },
  {
    id: '5',
    name: 'Beauty Boulevard',
    description: 'Beauty and skincare products',
    logo: '/shop-5.png',
    productCount: 23
  }
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    shopId: '1',
    name: 'Wireless Earbuds',
    price: 99.99,
    stockLevel: 4,
    description: 'High-quality wireless earbuds with noise cancellation',
    image: '/product-1.png'
  },
  {
    id: '2',
    shopId: '4',
    name: 'Smart Watch',
    price: 299.99,
    stockLevel: 35,
    description: 'Feature-rich smartwatch with health tracking',
    image: '/product-2.png'
  },
  {
    id: '3',
    shopId: '2',
    name: 'Designer Handbag',
    price: 299.99,
    stockLevel: 15,
    description: 'Luxury designer handbag',
    image: '/product-3.png'
  },
  {
    id: '4',
    shopId: '5',
    name: 'Summer Dress',
    price: 79.99,
    stockLevel: 25,
    description: 'Lightweight summer dress',
    image: '/product-4.png'
  },
  {
    id: '5',
    shopId: '3',
    name: 'Coffee Maker',
    price: 149.99,
    stockLevel: 20,
    description: 'Programmable coffee maker',
    image: '/product-5.png'
  }
]

export const MOCK_DASHBOARD_METRICS = {
  totalShops: MOCK_SHOPS.length,
  totalProducts: MOCK_SHOPS.reduce((acc, shop) => acc + shop.productCount, 0), 
  totalValue: MOCK_PRODUCTS.reduce((acc, product) => acc + (product.price * product.stockLevel), 0),
  totalStock: MOCK_PRODUCTS.reduce((acc, product) => acc + product.stockLevel, 0)
};


export const MOCK_STOCK_STATUS = [
  { 
    name: 'In Stock', 
    value: MOCK_PRODUCTS.filter(product => product.stockLevel > 5).length 
  },
  { 
    name: 'Low Stock', 
    value: MOCK_PRODUCTS.filter(product => product.stockLevel > 0 && product.stockLevel <= 5).length 
  },
  { 
    name: 'Out of Stock', 
    value: MOCK_PRODUCTS.filter(product => product.stockLevel === 0).length 
  }
];



export const MOCK_TOP_SHOPS = MOCK_SHOPS.map(shop => ({
  name: shop.name,
  stock: MOCK_PRODUCTS
    .filter(product => product.shopId === shop.id)
    .reduce((acc, product) => acc + product.stockLevel, 0)
}))
.sort((a, b) => b.stock - a.stock)
.slice(0, 5);
