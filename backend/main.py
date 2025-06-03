from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.chat_generate_recipes import generate_recipe_from_ingredients

class FoodItem(BaseModel):
    name: str
    calories: int

class IngredientsList(BaseModel):
    ingredients: list[str]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def generate_recipe(ingredients_data: IngredientsList):
    recipe = generate_recipe_from_ingredients(ingredients_data.ingredients)
    return {"message": recipe}

