# CMLB Recipe Catalog — Project Context

This file provides context for Claude Code and VS Code Claude extension sessions. Read this before making any changes.

---

## What This Is

A private recipe catalog web app for Chris and Lindsay. They use it to save, browse, and discover recipes. Claude is integrated directly into the app as a recipe suggestion assistant.

**Live site:** https://cjroberts28.github.io/cmlbRecipes
**GitHub repo:** https://github.com/CJRoberts28/cmlbRecipes

---

## Architecture

This is a fully static single-page app hosted on GitHub Pages. There is no traditional backend.

```
GitHub Pages (static)
├── index.html        — entire frontend SPA (HTML + CSS + JS in one file)
├── favicon.svg       — custom C&L monogram icon
├── CLAUDE.md         — this file
└── README.md         — user-facing documentation

Firebase (external services)
├── Authentication    — Google OAuth, whitelisted to two emails
├── Firestore         — recipe storage (NoSQL)
└── Cloud Functions   — single function: claudeProxy (Anthropic API proxy)

Anthropic API
└── Called via claudeProxy Cloud Function (never directly from browser)
```

### Why this architecture
- No cold starts (replaced an earlier Render/FastAPI backend that had this problem)
- No CORS issues (Cloud Function handles the Anthropic API call server-side)
- Free to run at this scale (Firebase Blaze plan, minimal usage)
- Everything in one HTML file keeps deployment simple — just push to GitHub

---

## Firebase Project

**Project ID:** cmlb-recipes
**Region:** us-central1

### Firestore
Collection: recipes
Each document has these fields:

- title (string)
- category (string) — Dinner | Lunch | Breakfast | Snack | Dessert | Side
- rating (number) — 1-5
- favorite (boolean)
- cook_time (number) — minutes
- tags (array of strings)
- date (string) — YYYY-MM-DD
- notes (string)
- components (array of objects) — each has: name, ingredients (string[]), steps (string[])
- createdBy (string) — email of who saved it
- updatedAt (string) — ISO timestamp

### Cloud Functions
**Location:** cmlb-functions/functions/index.js
**Function name:** claudeProxy
**URL:** https://us-central1-cmlb-recipes.cloudfunctions.net/claudeProxy

The function is a simple POST proxy: it receives {system, messages} from the frontend, attaches the Anthropic API key (stored as a Firebase Secret named ANTHROPIC_API_KEY), forwards to api.anthropic.com/v1/messages, and returns the response.

To redeploy after changes:
```bash
cd cmlb-functions
firebase deploy --only functions
```

### Auth
Google OAuth only. Whitelisted emails:
- c.jonesroberts@gmail.com (Chris)
- lrobertsmlt@gmail.com (Lindsay)

Firestore security rules restrict read/write to these two emails only.

---

## Frontend (index.html)

The entire frontend is a single HTML file. It uses vanilla JS with no build step, no npm, no bundler.

### Libraries loaded via CDN
- Firebase 10.12.0 (auth + firestore) — ES modules from gstatic
- Google Fonts — Playfair Display + Lora

### State management
A single state object holds all app state. render() re-renders the entire #root div on every state change. bindEvents() re-attaches all event listeners after each render.

```javascript
state = {
  user, recipes, selected,
  view,           // 'list' | 'detail' | 'form'
  search, category,
  successMsg, formError,
  editingId, form,
  showChat, chatMessages, chatLoading,
  pendingRecipe
}
```

### Mobile layout
- Below 767px: single-panel view with bottom nav (Recipes | Detail | Claude tabs)
- mobilePanel variable tracks which panel is active
- Chat panel uses position:fixed; top:0; bottom:60px to leave room for bottom nav
- 768px-1024px: two-column, chat as overlay
- Above 1024px: three-column (sidebar + main + chat panel)

### Key functions
- render() — full re-render
- renderDetail(r) — recipe detail view
- renderForm() — add/edit form
- renderChatPanelInner() — Claude chat panel contents
- formatStep(s, ingredients) — renders a step with bolded quantities/temps and ingredient amounts injected inline
- saveRecipe() — writes to Firestore
- deleteRecipe(id) — deletes from Firestore
- sendChat(message) — calls claudeProxy, parses recipe JSON from response
- loadRecipeFromChat() — loads Claude-suggested recipe into the add form

### Claude chat integration
Claude responds with conversational text plus a recipe JSON block wrapped in recipe tags. The app strips the JSON from the displayed message and shows a "Load into form" button when a recipe is detected. The system prompt instructs Claude to always include valid JSON in recipe tags.

---

## Design System

**Theme:** Rustic editorial — aged paper, earthy tones, serif typography
**Fonts:** Playfair Display (headings, italic accents) + Lora (body)

CSS variables:
- --bg: #f4f0e8 — parchment background
- --surface: #faf7f2 — card/panel background
- --surface2: #ede8de — input/filter background
- --border: #d4c9b4 — all borders
- --accent: #7a4a2a — primary brown, buttons, active states
- --accent-light: #b07040 — hover states, stars, ingredient amounts
- --accent-pale: #e8d8c4 — hover backgrounds
- --text: #2c1f0e — primary text
- --text-muted: #7a6248 — secondary text, step text
- --text-dim: #b09a80 — placeholder, disabled
- --red: #9b2335 — delete, favorites heart
- --green: #2d6a4f — success messages

**Design principles:**
- Minimal formatting, no unnecessary shadows or gradients
- Sharp corners (border-radius 3-4px) not rounded
- Uppercase spaced labels for field headings
- Italic Playfair Display for titles and section headers
- Paper texture overlay via SVG filter on body::before

---

## Known Issues / Notes

- Ingredient amount injection in steps works best when ingredients are formatted as "1 pound ground beef" rather than just "ground beef". Descriptive suffixes like ", drained and rinsed" are stripped automatically.
- The Firebase free invocation tier is very generous — at current usage (2 users) Cloud Function costs are negligible.
- GitHub Pages has no server-side logic — all routing, auth, and data fetching happens client-side.
- The Notion/FastAPI backend from an earlier iteration has been fully replaced and is no longer used.

---

## Backlog

- Nothing currently queued

---

## How to Make Changes

1. Edit index.html directly (no build step needed)
2. For Cloud Function changes, edit cmlb-functions/functions/index.js and run: firebase deploy --only functions
3. Push index.html to GitHub — GitHub Pages deploys automatically within ~30 seconds
4. Test on mobile with a hard refresh or incognito tab to bypass cache
