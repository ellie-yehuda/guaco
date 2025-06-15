# Analytics Plan – Guaco

## Core Events
| Event Name           | Triggered When |
|----------------------|----------------|
| `meal_logged`        | User adds a meal |
| `recipe_generated`   | AI returns recipe |
| `quest_completed`    | User completes a daily quest |
| `badge_earned`       | New badge unlocked |
| `onboarding_finished`| Onboarding flow completed |

## Funnels
- Onboarding completion
- Recipe generation → log → streak
- Retention at 1, 3, 7, 14 days

## Tools
- PostHog for event tracking
- GA4 for page views + bounce

