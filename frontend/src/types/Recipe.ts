// Recipe and Category types for the application

export interface Nutrition {
  kcalPerServing?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface Ingredient {
  name: string;
  amount?: string;
}

export interface Recipe {
  _id?: string;
  id?: string;
  title: string;
  categoryId: string;
  servings?: number;
  nutrition?: Nutrition;
  ingredients?: Ingredient[];
  steps?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  sort?: number;
}