

// Food categories and their items
const foodCategories = {
  'Fruits & Vegetables': [
    'Apple', 'Banana', 'Orange', 'Strawberries', 'Blueberries',
    'Tomato', 'Cucumber', 'Lettuce', 'Spinach', 'Carrot',
    'Potato', 'Onion', 'Garlic', 'Broccoli', 'Cauliflower',
    'Pepper', 'Zucchini', 'Mushrooms', 'Avocado', 'Lemon'
  ],
  'Meat & Seafood': [
    'Chicken Breast', 'Ground Beef', 'Salmon', 'Tuna', 'Shrimp',
    'Pork Chops', 'Turkey', 'Lamb', 'Cod', 'Tilapia'
  ],
  'Dairy & Eggs': [
    'Milk', 'Eggs', 'Cheese', 'Yogurt', 'Butter',
    'Cream', 'Sour Cream', 'Cottage Cheese', 'Cream Cheese'
  ],
  'Grains & Pasta': [
    'Rice', 'Pasta', 'Bread', 'Cereal', 'Oats',
    'Quinoa', 'Flour', 'Tortillas', 'Bagels'
  ],
  'Pantry Items': [
    'Olive Oil', 'Salt', 'Pepper', 'Sugar', 'Flour',
    'Baking Powder', 'Baking Soda', 'Vanilla Extract',
    'Honey', 'Maple Syrup', 'Soy Sauce', 'Vinegar'
  ],
  'Snacks': [
    'Chips', 'Nuts', 'Crackers', 'Popcorn', 'Pretzels',
    'Granola Bars', 'Trail Mix', 'Dried Fruit', 'Twix', 'Mars', 'Bisli', 'Chocolate',
    'Kinder', 'KitKat', 'Snickers', 'M&M', 'Skittles', 'Reese'
  ],
  'Beverages': [
    'Coffee', 'Tea', 'Juice', 'Soda', 'Water',
    'Wine', 'Beer', 'Sparkling Water'
  ],
  'Canned Goods': [
    'Beans', 'Soup', 'Tuna', 'Tomato Sauce', 'Corn',
    'Green Beans', 'Chickpeas', 'Diced Tomatoes'
  ],
  'Frozen Foods': [
    'Ice Cream', 'Frozen Pizza', 'Frozen Vegetables',
    'Frozen Fruit', 'Frozen Meals'
  ]
};

// Get category for a food item
export function getCategory(item: string): string {
  const normalizedItem = item.toLowerCase();
  for (const [category, items] of Object.entries(foodCategories)) {
    if (items.some(food => food.toLowerCase() === normalizedItem)) {
      return category;
    }
  }
  return 'Other';
}

// Get all food items for autocomplete
export function getAllFoodItems(): string[] {
  return Object.values(foodCategories).flat();
}

// Get suggestions for a partial input
export function getSuggestions(input: string): string[] {
  if (!input) return [];
  const normalizedInput = input.toLowerCase();
  return getAllFoodItems()
    .filter(item => item.toLowerCase().includes(normalizedInput))
    .slice(0, 8);
}

// Get all available categories
export function getAllCategories(): string[] {
  return Object.keys(foodCategories).sort();
}
