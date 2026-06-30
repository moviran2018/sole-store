export interface Shoe {
  id: string;
  name: string;
  namePersian: string;
  description: string;
  descriptionPersian: string;
  price: number;
  category: string;
  categoryPersian: string;
  sizes: number[];
  colors: { name: string; hex: string }[];
  image: string;
  images: string[];
  brand: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
  sale?: boolean;
  discount?: number;
  imageLinks?: string[];
  podcastLink?: string;
  videoLink?: string;
}

export interface CartItem extends Shoe {
  quantity: number;
  selectedSize: number;
  selectedColor: string;
}

export type Category = {
  id: string;
  name: string;
  namePersian: string;
  icon: string;
};
