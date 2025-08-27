North Star:

Weekly Active Meal Planners (WAMP): users who generate ≥1 recipe/daily plan in a given week. (Why: reflects the “plan → act” loop, not just browsing.)

Activation & Engagement:

Day-0 Activation Rate = % of signups who complete (generate recipe → add to day) within 24h.

Recipe Usefulness Rate = % of generated recipes that are saved / added to day / cooked (marked eaten).

Nutrition Tracking Adherence = median days/week with any intake logged per active user.

Grocery Conversion = % of sessions where items are added to grocery list; secondary: list-to-purchase mark-off rate (if you support ticking off items).

Session Depth = avg recipes generated per session and categories viewed.

Retention & Cohorts:
6) D1/D7 Retention among activated users (WAMP).
7) Returning Planner Rate (W/W) = % who planned in prior week and plan again this week.

Quality & Reliability (LLM + API):
8) Prompt Success Rate = % generations that parse successfully into ingredients/instructions (no 400/500; no “Failed to parse recipe” errors).
9) Latency P50/P95 for recipe generation end-to-end (button click → recipe visible).
10) Error Rate by endpoint (4xx/5xx), plus token usage per recipe (cost control).

Content Coverage (catalog health):
11) Ingredient Coverage = % of top user-entered ingredients that produce at least one valid recipe.
12) Category Balance = distribution of generated/saved recipes by category (avoid mode collapse).
