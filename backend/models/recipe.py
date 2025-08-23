from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Ingredient(BaseModel):
    name: str
    amount: Optional[str] = None

class RecipeIn(BaseModel):
    title: str
    ingredients: List[Ingredient]
    steps: List[str]
    categoryId: str
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