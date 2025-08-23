from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import re

from models.recipe import RecipeIn, Ingredient

router = APIRouter(prefix="/api/ai")

class RecipeTextInput(BaseModel):
    text: str

def extract_title(text: str) -> str:
    """Extract recipe title from text"""
    # Look for title at the beginning of the text or after a newline
    title_patterns = [
        r'^(?:Recipe(?:\s+for)?:?\s*)?([^\n\.]+)',  # Title at the beginning
        r'\n(?:Recipe(?:\s+for)?:?\s*)([^\n\.]+)',  # Title after newline
        r'(?:Title:?\s*)([^\n\.]+)',  # Explicit title label
    ]
    
    for pattern in title_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            title = match.group(1).strip()
            # Limit title length
            if len(title) > 100:
                title = title[:97] + "..."
            return title
    
    # Default title if no match found
    return "Untitled Recipe"

def extract_ingredients(text: str) -> List[Ingredient]:
    """Extract ingredients from text"""
    ingredients = []
    
    # Look for ingredients section
    ingredients_section_patterns = [
        r'(?:Ingredients?:?)(.*?)(?:Instructions|Directions|Method|Steps|Preparation|$)',
        r'(?:You(?:\s+will)?(?:\s+need):?)(.*?)(?:Instructions|Directions|Method|Steps|Preparation|$)',
    ]
    
    ingredients_text = ""
    for pattern in ingredients_section_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            ingredients_text = match.group(1).strip()
            break
    
    if not ingredients_text:
        # If no ingredients section found, try to extract from bullet points or numbered list
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if re.match(r'^[\-\*•·]|^\d+[\.\)]', line) and "step" not in line.lower() and "instruction" not in line.lower():
                # Remove bullet point or number
                ingredient_text = re.sub(r'^[\-\*•·]\s*|^\d+[\.\)]\s*', '', line).strip()
                if ingredient_text:
                    ingredients.append(parse_ingredient(ingredient_text))
    else:
        # Process ingredients section
        lines = ingredients_text.split('\n')
        for line in lines:
            line = line.strip()
            if line and not re.match(r'^(instructions|directions|method|steps|preparation):', line, re.IGNORECASE):
                # Remove bullet point or number if present
                ingredient_text = re.sub(r'^[\-\*•·]\s*|^\d+[\.\)]\s*', '', line).strip()
                if ingredient_text:
                    ingredients.append(parse_ingredient(ingredient_text))
    
    # If we still have no ingredients, try a more aggressive approach
    if not ingredients:
        # Look for common ingredient patterns
        ingredient_patterns = [
            r'(\d+(?:\s*\/\s*\d+)?(?:\s*[a-zA-Z]+)?\s+(?:cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|kg|ml|l|liter|pinch|dash)s?(?:\s+[^,\n]+))',
            r'(\d+(?:\s+to\s+\d+)?\s+[^,\n]+)',
        ]
        
        for pattern in ingredient_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                ingredient_text = match.group(1).strip()
                if ingredient_text and len(ingredient_text) < 100:  # Sanity check
                    ingredients.append(parse_ingredient(ingredient_text))
    
    # Remove duplicates while preserving order
    seen = set()
    unique_ingredients = []
    for ing in ingredients:
        if ing.name not in seen:
            seen.add(ing.name)
            unique_ingredients.append(ing)
    
    return unique_ingredients

def parse_ingredient(text: str) -> Ingredient:
    """Parse ingredient text into name and amount"""
    # Try to separate amount from name
    amount_patterns = [
        r'^(\d+(?:\s*\/\s*\d+)?(?:\s*[a-zA-Z]+)?\s+(?:cup|tbsp|tsp|tablespoon|teaspoon|oz|ounce|lb|pound|g|gram|kg|ml|l|liter|pinch|dash)s?(?:\s+of)?)\s+(.+)$',
        r'^(\d+(?:\s+to\s+\d+)?)\s+(.+)$',
    ]
    
    for pattern in amount_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            amount = match.group(1).strip()
            name = match.group(2).strip()
            return Ingredient(name=name, amount=amount)
    
    # If no pattern matches, assume it's just the name
    return Ingredient(name=text.strip())

def extract_steps(text: str) -> List[str]:
    """Extract preparation steps from text"""
    steps = []
    
    # Look for instructions section
    instructions_section_patterns = [
        r'(?:Instructions|Directions|Method|Steps|Preparation):?(.*?)(?:Notes|Tips|$)',
    ]
    
    instructions_text = ""
    for pattern in instructions_section_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        if match:
            instructions_text = match.group(1).strip()
            break
    
    if not instructions_text:
        # If no instructions section found, try to extract from numbered steps
        lines = text.split('\n')
        in_steps = False
        for line in lines:
            line = line.strip()
            if re.match(r'^(instructions|directions|method|steps|preparation):', line, re.IGNORECASE):
                in_steps = True
                continue
            
            if in_steps and line:
                # Remove step number if present
                step_text = re.sub(r'^[\-\*•·]\s*|^\d+[\.\)]\s*', '', line).strip()
                if step_text:
                    steps.append(step_text)
    else:
        # Process instructions section
        lines = instructions_text.split('\n')
        for line in lines:
            line = line.strip()
            if line:
                # Remove step number if present
                step_text = re.sub(r'^[\-\*•·]\s*|^\d+[\.\)]\s*', '', line).strip()
                if step_text:
                    steps.append(step_text)
    
    # If we still have no steps, try a more aggressive approach
    if not steps:
        # Split text into sentences and use those as steps
        sentences = re.split(r'(?<=[.!?])\s+', text)
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence and len(sentence) > 10 and sentence[-1] in ['.', '!', '?']:
                # Skip likely non-instruction sentences
                if not re.search(r'(ingredient|cup|tbsp|tsp|oz|lb|g|kg|ml|l)', sentence, re.IGNORECASE):
                    steps.append(sentence)
    
    # Combine very short steps
    combined_steps = []
    current_step = ""
    
    for step in steps:
        if len(current_step) + len(step) < 100:
            if current_step:
                current_step += " " + step
            else:
                current_step = step
        else:
            if current_step:
                combined_steps.append(current_step)
            current_step = step
    
    if current_step:
        combined_steps.append(current_step)
    
    return combined_steps

def extract_tags(text: str, title: str) -> List[str]:
    """Extract tags from recipe text and title"""
    tags = []
    
    # Common recipe tags
    tag_keywords = [
        "vegetarian", "vegan", "gluten-free", "dairy-free", "low-carb", "keto",
        "paleo", "breakfast", "lunch", "dinner", "dessert", "snack", "appetizer",
        "soup", "salad", "pasta", "chicken", "beef", "pork", "fish", "seafood",
        "quick", "easy", "healthy", "spicy", "sweet", "savory", "baked", "grilled",
        "fried", "roasted", "slow cooker", "instant pot", "one pot", "30-minute"
    ]
    
    # Check for tag keywords in title and text
    for keyword in tag_keywords:
        if keyword.lower() in title.lower() or keyword.lower() in text.lower():
            tags.append(keyword)
    
    # Limit to 5 tags maximum
    return tags[:5]

def determine_category(text: str, title: str) -> str:
    """Determine recipe category based on text and title"""
    # Default category ID
    default_category = "dinner"
    
    # Category keywords mapping
    category_keywords = {
        "breakfast": ["breakfast", "brunch", "morning", "pancake", "waffle", "omelette", "egg", "toast", "cereal", "oatmeal"],
        "lunch": ["lunch", "sandwich", "wrap", "salad", "soup", "quick lunch", "midday"],
        "dinner": ["dinner", "supper", "evening meal", "main course", "entree"],
        "healthy-snacks": ["healthy snack", "protein snack", "nutritious", "energy bite", "granola", "trail mix"],
        "sugary-snacks": ["sweet snack", "dessert", "cookie", "cake", "pie", "ice cream", "chocolate", "candy", "treat"],
        "desserts": ["dessert", "sweet", "cake", "cookie", "pie", "pastry", "chocolate", "ice cream"]
    }
    
    # Check title and text for category keywords
    combined_text = (title + " " + text).lower()
    
    for category_id, keywords in category_keywords.items():
        for keyword in keywords:
            if keyword.lower() in combined_text:
                return category_id
    
    return default_category

@router.post("/parse-recipe", response_model=RecipeIn)
async def parse_recipe(input_data: RecipeTextInput):
    """Parse recipe from text input"""
    if not input_data.text.strip():
        raise HTTPException(status_code=400, detail="Recipe text cannot be empty")
    
    text = input_data.text
    
    # Extract recipe components
    title = extract_title(text)
    ingredients = extract_ingredients(text)
    steps = extract_steps(text)
    tags = extract_tags(text, title)
    category_id = determine_category(text, title)
    
    # Validate extracted data
    if not title:
        title = "Untitled Recipe"
    
    if not ingredients:
        raise HTTPException(status_code=400, detail="Could not extract ingredients from the text")
    
    if not steps:
        raise HTTPException(status_code=400, detail="Could not extract preparation steps from the text")
    
    # Create and return recipe
    recipe = RecipeIn(
        title=title,
        ingredients=ingredients,
        steps=steps,
        categoryId=category_id,
        tags=tags if tags else None
    )
    
    return recipe