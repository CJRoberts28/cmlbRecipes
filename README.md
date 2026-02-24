# CMLB Recipe Catalog

A shared recipe catalog for CJ and his wife. Recipes are stored in Notion and served via a FastAPI backend hosted on Render.

## Live Site
[https://cjroberts28.github.io/cmlbRecipes](https://cjroberts28.github.io/cmlbRecipes)

## Stack
- **Frontend**: Static HTML/JS on GitHub Pages
- **Backend**: FastAPI (Python) on Render — [recipe-api-ysbb.onrender.com](https://recipe-api-ysbb.onrender.com)
- **Database**: Notion

## Adding Recipes via Claude

The easiest way to add a recipe is directly via the form on the site. But you can also use Claude to build an artifact that posts to the API.

### Quick Claude Prompt
Paste this into any Claude chat:
```
Read the recipe API spec at https://cjroberts28.github.io/cmlbRecipes/api-spec.md and build me an HTML artifact with a form to add a new recipe to our catalog.
```

### Full API Spec
See [api-spec.md](./api-spec.md) for the complete schema and endpoint documentation.

## Backend Repo
The Python backend (`main.py`, `requirements.txt`, `Procfile`) lives in a separate private repo and is deployed to Render.

### Environment Variables (set in Render)
- `NOTION_API_KEY` — Notion internal integration secret
- `NOTION_DATABASE_ID` — Notion database ID

## Note on Cold Starts
The Render free tier spins down after inactivity. The first request after a period of no use may take up to 60 seconds. The site handles this with a loading message.
