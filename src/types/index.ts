export interface Shop {
    id: string;
    name: string;
    description: string;
    logo: string;
    productCount: number;
  }
  
  export interface Product {
    id: string;
    shopId: string;
    name: string;
    price: number;
    stockLevel: number;
    description: string;
    image: string;
  }
  
  export interface DashboardMetrics {
    totalShops: number;
    totalProducts: number;
    totalValue: number;
    totalStock: number;
  }