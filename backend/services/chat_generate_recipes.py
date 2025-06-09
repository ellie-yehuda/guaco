# backend/services/chat_generate_recipes.py
import os
import re
from dotenv import load_dotenv
from openai import OpenAI
from typing import Dict, Union

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def parse_nutrition_values(text: str) -> Dict[str, Union[float, int]]:
    """Parse all nutrition values from the recipe text."""
    nutrition = {}
    
    # Helper function to extract numeric value with unit
    def extract_value(pattern: str) -> Union[float, int, None]:
        match = re.search(pattern, text, re.IGNORECASE)
        if not match:
            return None
        try:
            value = float(match.group(1))
            return int(value) if value.is_integer() else value
        except (ValueError, IndexError):
            return None

    # Basic nutrition
    nutrition["calories"] = extract_value(r"Calories:\s*([\d.]+)\s*kcal")
    nutrition["protein"] = extract_value(r"Protein:\s*([\d.]+)\s*g")
    nutrition["total_carbs"] = extract_value(r"(?:Total )?Carbs?:\s*([\d.]+)\s*g")
    nutrition["fiber"] = extract_value(r"Fiber:\s*([\d.]+)\s*g")
    nutrition["total_fat"] = extract_value(r"(?:Total )?Fat:\s*([\d.]+)\s*g")

    # Detailed fats
    nutrition["saturated_fat"] = extract_value(r"Saturated Fat:\s*([\d.]+)\s*g")
    nutrition["monounsaturated_fat"] = extract_value(r"Monounsaturated Fat:\s*([\d.]+)\s*g")
    nutrition["polyunsaturated_fat"] = extract_value(r"Polyunsaturated Fat:\s*([\d.]+)\s*g")
    nutrition["trans_fat"] = extract_value(r"Trans Fat:\s*([\d.]+)\s*g")
    nutrition["cholesterol"] = extract_value(r"Cholesterol:\s*([\d.]+)\s*mg")

    # Sugars
    nutrition["total_sugars"] = extract_value(r"Total Sugars:\s*([\d.]+)\s*g")
    nutrition["added_sugars"] = extract_value(r"Added Sugars:\s*([\d.]+)\s*g")

    # Minerals
    nutrition["sodium"] = extract_value(r"Sodium:\s*([\d.]+)\s*mg")
    nutrition["potassium"] = extract_value(r"Potassium:\s*([\d.]+)\s*mg")
    nutrition["calcium"] = extract_value(r"Calcium:\s*([\d.]+)\s*mg")
    nutrition["iron"] = extract_value(r"Iron:\s*([\d.]+)\s*mg")
    nutrition["magnesium"] = extract_value(r"Magnesium:\s*([\d.]+)\s*mg")
    nutrition["zinc"] = extract_value(r"Zinc:\s*([\d.]+)\s*mg")
    nutrition["selenium"] = extract_value(r"Selenium:\s*([\d.]+)\s*mcg")

    # Vitamins
    nutrition["vitamin_a"] = extract_value(r"Vitamin A:\s*([\d.]+)\s*IU")
    nutrition["vitamin_c"] = extract_value(r"Vitamin C:\s*([\d.]+)\s*mg")
    nutrition["vitamin_d"] = extract_value(r"Vitamin D:\s*([\d.]+)\s*IU")
    nutrition["vitamin_e"] = extract_value(r"Vitamin E:\s*([\d.]+)\s*mg")
    nutrition["vitamin_k"] = extract_value(r"Vitamin K:\s*([\d.]+)\s*mcg")
    nutrition["thiamin"] = extract_value(r"Thiamin:?\s*(?:\(B1\):)?\s*([\d.]+)\s*mg")
    nutrition["riboflavin"] = extract_value(r"Riboflavin:?\s*(?:\(B2\):)?\s*([\d.]+)\s*mg")
    nutrition["niacin"] = extract_value(r"Niacin:?\s*(?:\(B3\):)?\s*([\d.]+)\s*mg")
    nutrition["vitamin_b6"] = extract_value(r"(?:Vitamin )?B6:\s*([\d.]+)\s*mg")
    nutrition["vitamin_b12"] = extract_value(r"(?:Vitamin )?B12:\s*([\d.]+)\s*mcg")
    nutrition["folate"] = extract_value(r"Folate:\s*([\d.]+)\s*mcg")

    # Calculate net carbs if possible
    if nutrition["total_carbs"] is not None and nutrition["fiber"] is not None:
        nutrition["net_carbs"] = nutrition["total_carbs"] - nutrition["fiber"]
    else:
        nutrition["net_carbs"] = None

    # Remove None values
    return {k: v for k, v in nutrition.items() if v is not None}

def parse_recipe_metadata(text: str) -> Dict[str, Union[str, int]]:
    """Parse recipe metadata like title, prep time, etc."""
    metadata = {}
    
    # Extract title
    title_match = re.search(r"Title: (.*?)(?:\n|$)", text)
    metadata["title"] = title_match.group(1) if title_match else "Generated Recipe"
    
    # Extract times
    prep_match = re.search(r"Prep Time: (\d+)", text)
    cook_match = re.search(r"Cook Time: (\d+)", text)
    metadata["prep_time"] = prep_match.group(1) if prep_match else "15"
    metadata["cook_time"] = cook_match.group(1) if cook_match else "20"
    
    # Extract servings
    servings_match = re.search(r"Servings: (\d+)", text)
    metadata["servings"] = int(servings_match.group(1)) if servings_match else 4
    
    return metadata

def parse_recipe_sections(text: str) -> Dict[str, str]:
    """Parse recipe sections (ingredients, spices, instructions)."""
    sections = {}
    
    # Split into main content and detailed nutrition
    main_content = text.split('---Detailed Nutrition Facts---')[0]
    
    # Extract ingredients section
    ingredients_match = re.search(r"Ingredients:\n(.*?)(?=\n\n|\n[A-Z])", main_content, re.DOTALL)
    sections["ingredients"] = ingredients_match.group(1).strip() if ingredients_match else ""
    
    # Extract spices section
    spices_match = re.search(r"Spices & Seasonings:\n(.*?)(?=\n\n|\n[A-Z])", main_content, re.DOTALL)
    sections["spices"] = spices_match.group(1).strip() if spices_match else ""
    
    # Extract instructions section
    instructions_match = re.search(r"Instructions:\n(.*?)(?=\n\n|\n[A-Z])", main_content, re.DOTALL)
    sections["instructions"] = instructions_match.group(1).strip() if instructions_match else ""
    
    return sections

def generate_recipe_from_ingredients(ingredients: list[str]) -> Dict:
    """Generate a recipe and return structured data."""
    ingredients_list = ", ".join(ingredients)
    print("Ingredients received:", ingredients_list)

    prompt = f"""
You are Guaco's expert recipe engine and nutritionist. Generate a recipe following this EXACT format:

Title: [Recipe Name]

Prep Time: [X] minutes
Cook Time: [Y] minutes
Servings: [Z]

Ingredients:
• [ingredient 1 with quantity]
• [ingredient 2 with quantity]
[etc...]

Spices & Seasonings:
• [spice/seasoning 1 with quantity]
• [spice/seasoning 2 with quantity]
[etc...]

Instructions:
1. [Step 1]
2. [Step 2]
[etc...]

Basic Nutrition (per serving):
• Calories: [kcal]
• Protein: [g]
• Total Carbs: [g]
• Fiber: [g]
• Total Fat: [g]

---Detailed Nutrition Facts---

Fats:
• Saturated Fat: [g]
• Monounsaturated Fat: [g]
• Polyunsaturated Fat: [g]
• Trans Fat: [g]
• Cholesterol: [mg]

Sugars:
• Total Sugars: [g]
• Added Sugars: [g]

Minerals:
• Sodium: [mg]
• Potassium: [mg]
• Calcium: [mg]
• Iron: [mg]
• Magnesium: [mg]
• Zinc: [mg]
• Selenium: [mcg]

Vitamins:
• Vitamin A: [IU]
• Vitamin C: [mg]
• Vitamin D: [IU]
• Vitamin E: [mg]
• Vitamin K: [mcg]
• Thiamin (B1): [mg]
• Riboflavin (B2): [mg]
• Niacin (B3): [mg]
• Vitamin B6: [mg]
• Vitamin B12: [mcg]
• Folate: [mcg]

Rules:
1. Use ONLY the ingredients provided, plus basic pantry items (Seasonings, oils, vinegars, etc.)
2. Include realistic quantities for all ingredients.
3. Separate main ingredients from seasonings and spices.
4. Use USDA database values for nutrition facts and calculations.
5. Consider cooking method effects on nutrition.
6. Round appropriately: calories to nearest 10, grams to nearest 0.1, mg to nearest 10, mcg to nearest 10.
7. Include serving size and number of servings.

Now generate a recipe using exactly these ingredients: {ingredients_list}
"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a professional chef and certified nutritionist with expertise in detailed nutritional analysis."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )
    except Exception as e:
        print(f"Error generating recipe:", e)
        return {'error': str(e)}
    
    recipe_text = response.choices[0].message.content
    print("RAW AI RESPONSE CONTENT:\n", recipe_text)
    
    # Parse all recipe components
    metadata = parse_recipe_metadata(recipe_text)
    sections = parse_recipe_sections(recipe_text)
    nutrition = parse_nutrition_values(recipe_text)
    
    # Combine all data
    recipe_data = {
        **metadata,
        **sections,
        "nutrition": nutrition,
        "full_text": recipe_text  # Include full text for frontend formatting
    }
    print(recipe_data)
    return recipe_data

