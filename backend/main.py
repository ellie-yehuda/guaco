from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Union, Optional
from services.chat_generate_recipes import generate_recipe_from_ingredients
import json
from pathlib import Path

class FoodItem(BaseModel):
    name: str
    calories: int

class IngredientsList(BaseModel):
    ingredients: list[str]

class DetailedNutrition(BaseModel):
    calories: int
    protein: float
    total_carbs: float
    net_carbs: float
    fiber: float
    total_fat: float
    saturated_fat: float
    monounsaturated_fat: float
    polyunsaturated_fat: float
    trans_fat: float
    cholesterol: float
    sodium: float
    potassium: float
    total_sugars: float
    added_sugars: float
    vitamin_a: float
    vitamin_c: float
    vitamin_d: float
    vitamin_e: float
    vitamin_k: float
    thiamin: float
    riboflavin: float
    niacin: float
    vitamin_b6: float
    folate: float
    vitamin_b12: float
    calcium: float
    iron: float
    magnesium: float
    zinc: float
    selenium: float

class Recipe(BaseModel):
    title: str
    summary: str
    category: str
    instructions: str
    nutrition: DetailedNutrition
    servings: int = 1  # Default to 1 serving if not specified
    prepTime: str
    cookTime: str

class RecipeRequest(BaseModel):
    ingredients: List[str]

class NutritionData(BaseModel):
    calories: Optional[int] = None
    protein: Optional[float] = None
    total_carbs: Optional[float] = None
    net_carbs: Optional[float] = None
    fiber: Optional[float] = None
    total_fat: Optional[float] = None
    saturated_fat: Optional[float] = None
    monounsaturated_fat: Optional[float] = None
    polyunsaturated_fat: Optional[float] = None
    trans_fat: Optional[float] = None
    cholesterol: Optional[float] = None
    total_sugars: Optional[float] = None
    added_sugars: Optional[float] = None
    sodium: Optional[float] = None
    potassium: Optional[float] = None
    calcium: Optional[float] = None
    iron: Optional[float] = None
    magnesium: Optional[float] = None
    zinc: Optional[float] = None
    selenium: Optional[float] = None
    vitamin_a: Optional[float] = None
    vitamin_c: Optional[float] = None
    vitamin_d: Optional[float] = None
    vitamin_e: Optional[float] = None
    vitamin_k: Optional[float] = None
    thiamin: Optional[float] = None
    riboflavin: Optional[float] = None
    niacin: Optional[float] = None
    vitamin_b6: Optional[float] = None
    vitamin_b12: Optional[float] = None
    folate: Optional[float] = None

class RecipeResponse(BaseModel):
    title: str
    prep_time: str
    cook_time: str
    servings: int
    ingredients: str
    spices: str
    instructions: str
    nutrition: NutritionData
    full_text: str

app = FastAPI()

# Configure CORS with more permissive settings for development
origins = [
    "http://localhost:5174",  # or whatever your frontend origin is
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # must be specific, not "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Path to store recipes
RECIPES_FILE = Path("data/recipes.json")

# Initialize recipes file if it doesn't exist
if not RECIPES_FILE.exists():
    RECIPES_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(RECIPES_FILE, "w") as f:
        json.dump({}, f)

def load_recipes():
    try:
        with open(RECIPES_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_recipes(recipes):
    with open(RECIPES_FILE, "w") as f:
        json.dump(recipes, f, indent=2)

@app.post("/api/recipes")
def save_recipe(recipe: Recipe):
    recipes = load_recipes()
    
    # Initialize category if it doesn't exist
    if recipe.category not in recipes:
        recipes[recipe.category] = []
    
    # Add recipe with a unique ID
    recipe_dict = recipe.dict()
    recipe_dict["id"] = str(len(recipes[recipe.category]) + 1)  # Simple ID generation
    
    # Calculate per-serving nutrition if more than 1 serving
    if recipe.servings > 1:
        nutrition = recipe.nutrition
        recipe_dict["nutrition_per_serving"] = {
            "calories": round(nutrition.calories / recipe.servings),
            "protein": round(nutrition.protein / recipe.servings, 1),
            "total_carbs": round(nutrition.total_carbs / recipe.servings, 1),
            "net_carbs": round(nutrition.net_carbs / recipe.servings, 1),
            "fiber": round(nutrition.fiber / recipe.servings, 1),
            "total_fat": round(nutrition.total_fat / recipe.servings, 1),
            "saturated_fat": round(nutrition.saturated_fat / recipe.servings, 1),
            "monounsaturated_fat": round(nutrition.monounsaturated_fat / recipe.servings, 1),
            "polyunsaturated_fat": round(nutrition.polyunsaturated_fat / recipe.servings, 1),
            "trans_fat": round(nutrition.trans_fat / recipe.servings, 1),
            "cholesterol": round(nutrition.cholesterol / recipe.servings, 1),
            "sodium": round(nutrition.sodium / recipe.servings),
            "potassium": round(nutrition.potassium / recipe.servings),
            "total_sugars": round(nutrition.total_sugars / recipe.servings, 1),
            "added_sugars": round(nutrition.added_sugars / recipe.servings, 1),
            "vitamin_a": round(nutrition.vitamin_a / recipe.servings, 1),
            "vitamin_c": round(nutrition.vitamin_c / recipe.servings, 1),
            "vitamin_d": round(nutrition.vitamin_d / recipe.servings, 1),
            "vitamin_e": round(nutrition.vitamin_e / recipe.servings, 1),
            "vitamin_k": round(nutrition.vitamin_k / recipe.servings, 1),
            "thiamin": round(nutrition.thiamin / recipe.servings, 1),
            "riboflavin": round(nutrition.riboflavin / recipe.servings, 1),
            "niacin": round(nutrition.niacin / recipe.servings, 1),
            "vitamin_b6": round(nutrition.vitamin_b6 / recipe.servings, 1),
            "folate": round(nutrition.folate / recipe.servings, 1),
            "vitamin_b12": round(nutrition.vitamin_b12 / recipe.servings, 1),
            "calcium": round(nutrition.calcium / recipe.servings),
            "iron": round(nutrition.iron / recipe.servings, 1),
            "magnesium": round(nutrition.magnesium / recipe.servings),
            "zinc": round(nutrition.zinc / recipe.servings, 1),
            "selenium": round(nutrition.selenium / recipe.servings, 1)
        }
    
    recipes[recipe.category].append(recipe_dict)
    save_recipes(recipes)
    return recipe_dict

@app.get("/api/recipes/{category}")
def get_recipes(category: str):
    recipes = load_recipes()
    return recipes.get(category, [])

@app.get("/api/hello")
def hello():
    return {"message": "Hello from FastAPI!"}

@app.post("/api/food")
def add_food(food: FoodItem):
    return {"message": f"Received food: {food.name} with {food.calories} calories"}

# Generate a recipe from a list of ingredients, return a recipe object
# use the chat_generate_recipes.py file to generate the recipe
# function meant for the grocery list page
@app.post("/api/generate_recipe_from_ingredients")
async def generate_recipe(request: RecipeRequest):
    try:
        if not request.ingredients:
            raise HTTPException(status_code=400, detail="No ingredients provided")
        
        if len(request.ingredients) < 1:
            raise HTTPException(status_code=400, detail="At least one ingredient is required")
            
        print(f"Received ingredients: {request.ingredients}")  # Enhanced debug log
        
        recipe_data = generate_recipe_from_ingredients(request.ingredients)
        
        if not recipe_data:
            raise HTTPException(status_code=500, detail="Failed to generate recipe")
            
        if "error" in recipe_data:
            raise HTTPException(status_code=500, detail=recipe_data["error"])
            
        return recipe_data
        
    except HTTPException as he:
        print(f"HTTP Exception in generate_recipe: {str(he)}")  # Debug log
        raise he
    except Exception as e:
        print(f"Unexpected error in generate_recipe: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

