export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  category: string;
  deliveryTime: string;
  image: string;
  description?: string;
  address?: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}


export interface Category{
  id: number;
  name: string;
  emoji: string;
}