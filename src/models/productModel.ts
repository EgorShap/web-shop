export interface Product {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  count: number;
  size: { width: number; height: number };
  weight: number;
  comments: Comment[];
}

export interface Comment {
  id: number;
  productId: number;
  description: string;
  date: string;
}
