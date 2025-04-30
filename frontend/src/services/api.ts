import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default API_URL;

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export interface Product {
  id: string;
  name: string;
  price: number;
  qty: number;
  photo: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  parentCategory?: Category | null;
  childCategories?: Category[];
}

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>('/product');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Product>(`/product/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, 'id'>) => {
    const response = await api.post<Product>('/product', product);
    return response.data;
  },

  update: async (id: string, product: Omit<Product, 'id'>) => {
    const response = await api.patch<Product>(`/product/${id}`, product);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get<Category[]>('/category');
    return response.data;
  }
};