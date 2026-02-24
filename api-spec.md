# CMLB Recipe Catalog — API Spec for Claude

This document is intended to be read by a Claude session to enable building an artifact that can add or update recipes in the shared recipe catalog.

## API Base URL
```
https://recipe-api-ysbb.onrender.com
```

Note: The API runs on Render's free tier and may take up to 60 seconds to respond on first request after inactivity. Build in appropriate loading/retry handling.

---

## Endpoints

### GET /recipes
Returns all recipes sorted by date descending.

### GET /recipes/{id}
Returns a single recipe by Notion page ID.

### POST /recipes
Creates a new recipe. Body: Recipe object (see schema below).

### PATCH /recipes/{id}
Updates an existing recipe. Body: Recipe object.

### DELETE /recipes/{id}
Deletes a recipe by ID.

---

## Recipe Schema

```json
{
  "title": "string (required)",
  "category": "string — one of: Dinner, Lunch, Breakfast, Snack, Dessert, Side",
  "rating": "integer 1–5",
  "favorite": "boolean",
  "cook_time": "integer (minutes) or null",
  "tags": ["array", "of", "strings"],
  "date": "string YYYY-MM-DD",
  "notes": "string — free-form observations, tips, variations",
  "components": [
    {
      "name": "string — component name e.g. Roasted Potatoes",
      "ingredients": ["array of ingredient strings"],
      "steps": ["array of step strings"]
    }
  ]
}
```

A recipe can have multiple components (e.g. a dinner with roasted potatoes, broccoli, and chicken would have 3 components).

---

## Response Schema

Responses include all fields above plus:
```json
{
  "id": "string — Notion page ID, used for PATCH and DELETE"
}
```

---

## Example: Adding a Recipe

```javascript
const recipe = {
  title: "Honey Mustard Roasted Potatoes",
  category: "Side",
  rating: 5,
  favorite: true,
  cook_time: 35,
  tags: ["easy", "sheet pan", "vegetables"],
  date: "2026-02-24",
  notes: "Blanching first gives a much crispier result.",
  components: [
    {
      name: "Honey Mustard Roasted Potatoes",
      ingredients: ["Red and yellow potatoes", "Dijon mustard", "Honey", "Olive oil", "Salt", "Pepper"],
      steps: [
        "Blanch halved potatoes in salted boiling water for 5–7 minutes. Drain and steam dry.",
        "Mix equal parts Dijon and honey with a splash of olive oil.",
        "Toss potatoes in honey mustard mix.",
        "Roast at 425°F for 25–30 minutes, flipping halfway."
      ]
    }
  ]
};

const res = await fetch("https://recipe-api-ysbb.onrender.com/recipes", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(recipe)
});
const saved = await res.json();
console.log("Saved with ID:", saved.id);
```

---

## Instructions for Claude

When a user asks you to build an artifact to add a recipe:

1. Fetch this spec from `https://cjroberts28.github.io/cmlbRecipes/api-spec.md` to get the latest schema
2. Build a clean HTML or React artifact with a form that matches the schema
3. The artifact runs in the user's browser, so it CAN make fetch() calls to the API directly
4. Pre-populate the form if the user has already described the recipe
5. After saving, show the returned recipe ID and a success message
6. Handle the Render cold-start delay gracefully with a loading state

The catalog website is at: `https://cjroberts28.github.io/cmlbRecipes`

The user's name is CJ. His wife also uses the catalog. Both use Claude to help add recipes.

---

## Claude Prompt to Build the Add-Recipe Artifact

Copy and paste this into any Claude chat to get a working add-recipe artifact:

```
Read the recipe API spec at https://cjroberts28.github.io/cmlbRecipes/api-spec.md and build me an HTML artifact with a form to add a new recipe to our catalog. The artifact should match the full schema, support multiple components with ingredients and steps, and POST to the API when I click Save. Handle the Render cold-start delay with a loading indicator.
```
