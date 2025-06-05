export type NutritionData = {
  calories?: number;
  protein?: number;
  total_carbs?: number;
  net_carbs?: number;
  fiber?: number;
  total_fat?: number;
  saturated_fat?: number;
  monounsaturated_fat?: number;
  polyunsaturated_fat?: number;
  trans_fat?: number;
  cholesterol?: number;
  total_sugars?: number;
  added_sugars?: number;
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  zinc?: number;
  selenium?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  vitamin_d?: number;
  vitamin_e?: number;
  vitamin_k?: number;
  thiamin?: number;
  riboflavin?: number;
  niacin?: number;
  vitamin_b6?: number;
  vitamin_b12?: number;
  folate?: number;
};

export type Recipe = {
  title: string;
  summary: string;
  instructions: string;
  ingredients: string;
  spices: string;
  servings: number;
  prep_time: string;
  cook_time: string;
  nutrition: NutritionData;
  full_text: string;
  prepTime?: string; // For backward compatibility
  cookTime?: string; // For backward compatibility
}; 