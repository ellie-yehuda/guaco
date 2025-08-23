from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional

from models.recipe import RecipeIn, RecipeOut, CategoryIn, CategoryOut
from repositories.factory import repository_factory

router = APIRouter(prefix="/api")

# Get repository instances
recipe_repo = repository_factory.get_repository("recipes")
category_repo = repository_factory.get_repository("categories")

@router.get("/categories", response_model=List[CategoryOut])
async def list_categories():
    """List all available categories"""
    categories = await category_repo.list()
    return categories

@router.post("/categories", response_model=CategoryOut)
async def create_category(category: CategoryIn):
    """Create a new category (idempotent by slug)"""
    # Check if category with this slug already exists
    existing_categories = await category_repo.list({"slug": category.slug})
    
    if existing_categories:
        # Return existing category if slug already exists
        return existing_categories[0]
    
    # Create new category
    category_id = await category_repo.create(category)
    created_category = await category_repo.get(category_id)
    
    if not created_category:
        raise HTTPException(status_code=500, detail="Failed to create category")
    
    return created_category

@router.post("/recipes", response_model=RecipeOut)
async def create_recipe(recipe: RecipeIn):
    """Create a new recipe"""
    # Verify category exists
    categories = await category_repo.list({"_id": recipe.categoryId})
    if not categories:
        raise HTTPException(status_code=404, detail=f"Category with ID {recipe.categoryId} not found")
    
    # Create recipe
    recipe_id = await recipe_repo.create(recipe)
    created_recipe = await recipe_repo.get(recipe_id)
    
    if not created_recipe:
        raise HTTPException(status_code=500, detail="Failed to create recipe")
    
    return created_recipe

@router.get("/recipes", response_model=List[RecipeOut])
async def list_recipes(category_id: Optional[str] = Query(None, alias="categoryId")):
    """List recipes with optional category filter"""
    filter_params = {}
    if category_id:
        filter_params["categoryId"] = category_id
    
    recipes = await recipe_repo.list(filter_params)
    return recipes

@router.get("/recipes/{recipe_id}", response_model=RecipeOut)
async def get_recipe(recipe_id: str):
    """Get a recipe by ID"""
    recipe = await recipe_repo.get(recipe_id)
    
    if not recipe:
        raise HTTPException(status_code=404, detail=f"Recipe with ID {recipe_id} not found")
    
    return recipe

@router.put("/recipes/{recipe_id}", response_model=RecipeOut)
async def update_recipe(recipe_id: str, recipe: RecipeIn):
    """Update a recipe by ID"""
    # Verify recipe exists
    existing_recipe = await recipe_repo.get(recipe_id)
    if not existing_recipe:
        raise HTTPException(status_code=404, detail=f"Recipe with ID {recipe_id} not found")
    
    # Verify category exists
    categories = await category_repo.list({"_id": recipe.categoryId})
    if not categories:
        raise HTTPException(status_code=404, detail=f"Category with ID {recipe.categoryId} not found")
    
    # Update recipe
    success = await recipe_repo.update(recipe_id, recipe)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update recipe")
    
    updated_recipe = await recipe_repo.get(recipe_id)
    return updated_recipe

@router.delete("/recipes/{recipe_id}", status_code=204)
async def delete_recipe(recipe_id: str):
    """Delete a recipe by ID"""
    # Verify recipe exists
    existing_recipe = await recipe_repo.get(recipe_id)
    if not existing_recipe:
        raise HTTPException(status_code=404, detail=f"Recipe with ID {recipe_id} not found")
    
    # Delete recipe
    success = await recipe_repo.delete(recipe_id)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete recipe")