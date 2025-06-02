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
    # Join the Python list into a comma-separated string for readability
    ingredients_list = ", ".join(ingredients)
    
    prompt = f"""
You are Guaco’s expert recipe engine. The user will supply a list of ingredients; your job is to output a fully realistic, easy-to-follow recipe that someone can actually cook at home. Follow these rules exactly:

1. Use **only** the provided ingredients plus basic pantry items (salt, pepper, oil, water, sugar,butter,etc). Do not add any other spices, vegetables, sauces, or extras.
2. Include realistic quantities for each ingredient (for example, “200 g tofu,” “2 cups spinach,” “1 medium tomato”). 
3. Provide:
   • **Title**  
   • **Prep Time:** (in minutes)  
   • **Cook Time:** (in minutes)  
   • **Ingredients:** a bullet-list with each item and its quantity  
   • **Instructions:** step-by-step directions numbered clearly so a home cook can follow without guessing  
4. If you know of an actual, established recipe that uses exactly these ingredients (plus salt, pepper, oil, water, etc), output that recipe.  
5. If no real recipe exists with exactly those ingredients, then output a recipe that is as close as possible. In that case:
   • Identify the recipe you’re adapting (e.g., “This is an adaptation of X recipe.”).  
   • Note any slight substitutions you’re forced to make (for example, “In the original recipe they used soy sauce; here we omit it because it’s not in the ingredient list, but we compensate by adding a pinch of salt.”).  
6. Do **not** output anything other than the requested recipe fields (title, times, ingredient list, instructions). No extra commentary or explanation.

**Template:**  
Title: <Recipe Name>  
Prep Time: <minutes>  
Cook Time: <minutes>  
Ingredients:  
• <quantity> <ingredient>  
• <quantity> <ingredient>  
…  
Instructions:  
1. <First step>  
2. <Next step>  
…

**Example prompt input (for you to replace with actual values):**  
Ingredients: [“spinach”, “tomato”, “tofu”]

**Example expected output:**  
Title: Lemon-Garlic Tofu & Spinach Skillet  
Prep Time: 10 minutes  
Cook Time: 15 minutes  
Ingredients:  
• 200 g firm tofu, cubed  
• 2 cups fresh spinach, roughly chopped  
• 1 medium tomato, diced  
• 1 tbsp olive oil  
• ½ tsp salt  
• ¼ tsp black pepper  
• 2 tbsp water  
Instructions:  
1. Heat 1 tbsp olive oil in a nonstick skillet over medium heat.  
2. Add cubed tofu; season with ½ tsp salt and ¼ tsp black pepper. Sauté for 5 minutes, turning occasionally until lightly golden.  
3. Add diced tomato and cook for 2 more minutes until it softens.  
4. Stir in chopped spinach and 2 tbsp water. Cover for 2 minutes, until spinach wilts.  
5. Uncover, stir gently, and serve hot.

Now generate a recipe using exactly these ingredients: {ingredients_list}

"""
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt.strip()}]
    )
    print(response.choices[0].message.content)
    return response.choices[0].message.content
