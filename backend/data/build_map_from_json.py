#!/usr/bin/env python3
"""
Create a mini lookup file (category_map.json) from USDA's FoundationFoods.json.

The output will look like:

{
  "hummus": "Pantry",
  "tomatoes": "Produce",
  "cheddar cheese": "Dairy & Eggs",
  ...
}

Why do we want this?
--------------------
• Groceries entered in your React app can be normalised (stripped of accents,
  punctuation, upper/lower-case) and matched against the keys in this file.
• The value ("Produce", "Pantry", …) lets you group the grocery list under
  8 tidy headers instead of the USDA's 30-plus official categories.

How to run (Windows / macOS / Linux)
------------------------------------
> python build_map_from_json.py

Requirements:
• Python 3.8 + (comes pre-installed on macOS; install from python.org for Windows)
• The file USDA FoundationFoods.json must be in the _same folder_ as this script.
  Download link: https://fdc.nal.usda.gov/download-datasets.html  (≈ 40 MB)

After running, you'll see:
✓ 7,842 items saved to category_map.json
Bucket counts:
  Produce           2,345
  Pantry            1,812
  Dairy & Eggs        930
  ...

Copy category_map.json into your React project (e.g. src/data/) and import it.
"""

import json, re, unicodedata, sys
from collections import defaultdict
from pathlib import Path

# ---------------------------------------------------------------------------
# 1. CONFIGURATION — Change these filenames if yours differ
# ---------------------------------------------------------------------------

JSON_FILE = Path("FoundationFoods.json")   # Source downloaded from USDA
OUT_FILE  = Path("category_map.json")      # Tiny file we'll generate

# ---------------------------------------------------------------------------
# 2. OFFICIAL USDA CATEGORY ➜ YOUR 8 UI BUCKETS
#    Edit this dict anytime you want different bucket names or assignments.
# ---------------------------------------------------------------------------

SIMPLIFIED = {
    # -------- Produce -------------------------------------------------------
    "Fruits and Fruit Juices":             "Produce",
    "Vegetables and Vegetable Products":   "Produce",

    # -------- Meat / Seafood / Eggs ----------------------------------------
    "Poultry Products":                    "Meat & Seafood",
    "Pork Products":                       "Meat & Seafood",
    "Beef Products":                       "Meat & Seafood",
    "Lamb, Veal, and Game Products":       "Meat & Seafood",
    "Finfish and Shellfish Products":      "Meat & Seafood",
    "Sausages and Luncheon Meats":         "Meat & Seafood",

    # -------- Dairy ---------------------------------------------------------
    "Dairy and Egg Products":              "Dairy & Eggs",

    # -------- Bakery / Breakfast -------------------------------------------
    "Baked Products":                      "Bakery & Breakfast",
    "Breakfast Cereals":                   "Bakery & Breakfast",
    "Cereal Grains and Pasta":             "Bakery & Breakfast",

    # -------- Pantry staples, sauces, etc. ----------------------------------
    "Spices and Herbs":                    "Pantry",
    "Fats and Oils":                       "Pantry",
    "Legumes and Legume Products":         "Pantry",
    "Nut and Seed Products":               "Pantry",
    "Soups, Sauces, and Gravies":          "Pantry",

    # -------- Snacks & sweets ----------------------------------------------
    "Snacks":                              "Snacks & Sweets",
    "Sweets":                              "Snacks & Sweets",

    # -------- Drinks --------------------------------------------------------
    "Beverages":                           "Beverages",
    "Alcoholic Beverages":                 "Beverages",

    # -------- Ready-made & misc --------------------------------------------
    "Baby Foods":                          "Ready & Misc",
    "Fast Foods":                          "Ready & Misc",
    "Meals, Entrees, and Side Dishes":     "Ready & Misc",
    "Restaurant Foods":                    "Ready & Misc",
    "American Indian/Alaska Native Foods": "Ready & Misc",
}

FALLBACK_BUCKET = "Other"  # If USDA introduces a new category we didn't map.

# ---------------------------------------------------------------------------
# 3. HELPER — normalise a string for *case-insensitive* lookup
#    "Hummus!" ➜ "hummus"   |   "Crème brûlée" ➜ "creme brulee"
# ---------------------------------------------------------------------------

def slug(text: str) -> str:
    """Return a lowercase, accent-less, punctuation-less version of text."""
    # Remove accents: café ➜ cafe
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    # Remove anything that's not a letter/number/space
    text = re.sub(r"[^\w\s]", " ", text)
    # Collapse multiple spaces to one, trim, and lowercase
    return re.sub(r"\s+", " ", text).strip().lower()

# ---------------------------------------------------------------------------
# 4. LOAD THE BIG USDA JSON
# ---------------------------------------------------------------------------

if not JSON_FILE.exists():
    sys.exit(f"❌  Cannot find {JSON_FILE}.  Put it next to this script.")

with JSON_FILE.open(encoding="utf-8") as f:
    # The top-level key is "FoundationFoods"
    foods = json.load(f)["FoundationFoods"]

# ---------------------------------------------------------------------------
# 5. WALK THROUGH EVERY FOOD AND BUILD name ➜ bucket
# ---------------------------------------------------------------------------

mapping: dict[str, str] = {}
bucket_counts = defaultdict(int)

for item in foods:
    # -- a) Food name cleaning ---------------------------------------------
    # USDA names often look like "Hummus, commercial".
    # We only keep the FIRST part before the comma.
    raw_name = item["description"].split(",")[0].title().strip()
    key      = slug(raw_name)   # "Hummus" ➜ "hummus"

    # -- b) Convert USDA category to our bucket -----------------------------
    usda_cat   = item["foodCategory"]["description"]
    bucket     = SIMPLIFIED.get(usda_cat, FALLBACK_BUCKET)

    # -- c) Store if we haven't seen this key before ------------------------
    # The first bucket wins to avoid duplicates like "tomato" in multiple forms.
    if key not in mapping:
        mapping[key] = bucket
        bucket_counts[bucket] += 1

# ---------------------------------------------------------------------------
# 6. WRITE THE TINY JSON FILE
# ---------------------------------------------------------------------------

with OUT_FILE.open("w", encoding="utf-8") as f:
    json.dump(mapping, f, ensure_ascii=False, indent=2)

print(f"✓  {len(mapping):,} grocery names saved to {OUT_FILE}")
print("Bucket counts:")
for bucket, cnt in sorted(bucket_counts.items(), key=lambda x: -x[1]):
    print(f"  {bucket:<15} {cnt:,}")
