# backend/services/chat_generate_recipes.py
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
print("OPENAI_API_KEY is", os.getenv("OPENAI_API_KEY"))
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

# Generate a recipe from a list of ingredients
# @param ingredients: list of ingredients
# @return recipe: recipe
def generate_recipe_from_ingredients(ingredients):
    ingredients_list = ", ".join(ingredients)
    
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
[Only include this section - it will be hidden by default]

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
• Folate: [mcg]
• Vitamin B12: [mcg]

Rules:
1. Use ONLY the provided ingredients plus basic pantry items (salt, pepper, oil, water, etc).
2. Include realistic quantities for all ingredients.
3. Separate main ingredients from spices/seasonings.
4. Use USDA database values for nutrition calculations.
5. Consider cooking method effects on nutrition.
6. Round appropriately:
   - Calories to whole numbers
   - Macros to 0.1g
   - Vitamins/minerals to appropriate units
7. Include serving size and number of servings.

Now generate a recipe using exactly these ingredients: {ingredients_list}
"""
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a professional chef and certified nutritionist with expertise in detailed nutritional analysis."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )
    
    return response.choices[0].message.content
