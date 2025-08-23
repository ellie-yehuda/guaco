// Recipe and Category types for the application

export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  _id?: string;
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  categoryId: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id?: string;
  name: string;
  slug: string;
  sort?: number;
}