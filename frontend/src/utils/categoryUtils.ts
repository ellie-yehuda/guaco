import categoryDict from "../../../backend/data/category_map.json";
import Papa from 'papaparse';

// Type definitions
type CategoryMap = { [key: string]: string };
type CacheMap = { [key: string]: { category: string; source: 'json' | 'csv' } };

// Initialize cache
const categoryCache: CacheMap = {};

// Load and parse CSV data
let csvCategories: CategoryMap = {};
let allFoodItems: string[] = [];

// Load CSV data
async function loadCsvData() {
  try {
    const response = await fetch('http://localhost:8000/api/grocery-data/csv');
    const csvText = await response.text();
    const results = Papa.parse(csvText, { header: true });
    
    if (results.data && Array.isArray(results.data)) {
      results.data.forEach((row: any) => {
        if (row['Title'] && row['Sub Category']) {
          const title = cleanTitle(row['Title']);
          csvCategories[title] = row['Sub Category'];
          allFoodItems.push(title);
        }
      });
    }

    // Add JSON items to allFoodItems
    allFoodItems = [
      ...allFoodItems,
      ...Object.keys(categoryDict as CategoryMap)
    ];
  } catch (error) {
    console.warn('Failed to load CSV categories:', error);
  }
}

// Initialize data loading
loadCsvData();

// Clean and normalize text for matching
function cleanTitle(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Get category with caching and fallback
export function getCategory(name: string): string {
  const cleanName = cleanTitle(name);
  
  // Check cache first
  if (categoryCache[cleanName]) {
    return categoryCache[cleanName].category;
  }

  // Check JSON dictionary first (primary source)
  if (cleanName in categoryDict) {
    const category = (categoryDict as CategoryMap)[cleanName];
    categoryCache[cleanName] = { category, source: 'json' };
    return category;
  }

  // Try CSV categories as fallback
  for (const [csvTitle, category] of Object.entries(csvCategories)) {
    if (csvTitle.includes(cleanName) || cleanName.includes(csvTitle)) {
      categoryCache[cleanName] = { category, source: 'csv' };
      return category;
    }
  }

  // Default category if not found
  categoryCache[cleanName] = { category: 'Other', source: 'json' };
  return 'Other';
}

// Export helper functions
export function getCategorySource(name: string): 'json' | 'csv' | 'default' {
  const cleanName = cleanTitle(name);
  return categoryCache[cleanName]?.source || 'default';
}

export function clearCategoryCache(): void {
  Object.keys(categoryCache).forEach(key => delete categoryCache[key]);
}

// Get all available categories
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  
  // Add categories from JSON
  Object.values(categoryDict as CategoryMap).forEach(cat => categories.add(cat));
  
  // Add categories from CSV
  Object.values(csvCategories).forEach(cat => categories.add(cat));
  
  return Array.from(categories).sort();
}

// Get all food items for autocomplete
export function getAllFoodItems(): string[] {
  return Array.from(new Set(allFoodItems)).sort();
} 