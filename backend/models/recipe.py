from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Nutrition(BaseModel):
    kcalPerServing: Optional[float] = None
    protein: Optional[float] = None
    carbs: Optional[float] = None
    fat: Optional[float] = None

class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None

class RecipeIn(BaseModel):
    title: str
    categoryId: str
    servings: Optional[int] = 1
    nutrition: Optional[Nutrition] = None
    ingredients: Optional[List[Ingredient]] = None
    steps: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class RecipeOut(RecipeIn):
    id: str = Field(..., alias="_id")
    createdAt: datetime
    updatedAt: datetime

class CategoryIn(BaseModel):
    name: str
    slug: str
    sort: Optional[int] = None

class CategoryOut(CategoryIn):
    id: str = Field(..., alias="_id")