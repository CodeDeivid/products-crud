import { Category } from '../../category/entities/category.entity';

export class Product {
  id: string;
  name: string;
  qty: number;
  price: number;
  photo: string;
  categories: Category[];
}
