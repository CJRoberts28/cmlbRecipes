# CMLB Recipe Catalog

Chris & Lindsay's private recipe catalog with Google Auth, Firestore storage, and Claude-powered recipe suggestions.

## Live Site
[https://cjroberts28.github.io/cmlbRecipes](https://cjroberts28.github.io/cmlbRecipes)

## Stack
- **Frontend**: Static HTML/JS on GitHub Pages
- **Auth**: Firebase Google Authentication (whitelist: c.jonesroberts@gmail.com, lrobertsmlt@gmail.com)
- **Database**: Firebase Firestore
- **AI**: Claude via Anthropic API (called directly from browser)
- **Backend**: None — Render is no longer needed

## Features
- Google sign-in (private, whitelisted accounts only)
- Browse, add, edit, delete recipes
- Claude chat panel for recipe ideas — suggests recipes and loads them into the form with one click
- Recipes shared in real time via Firestore

## Firestore Security Rules
Set these in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /recipes/{recipeId} {
      allow read, write: if request.auth != null &&
        request.auth.token.email in [
          'c.jonesroberts@gmail.com',
          'lrobertsmlt@gmail.com'
        ];
    }
  }
}
```

## No backend needed
The Render/FastAPI backend is no longer part of this stack. Everything runs directly from the browser via Firebase and the Anthropic API.
