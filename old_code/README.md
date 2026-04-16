# Old Code Archive

This folder contains the original code before the static site conversion.

## Files Archived

These files represent the state of the code at commit `186bc91` (before static conversion):

- **sections.ts.old** - Original API fetching code that called `/content-ws` endpoint
- **vite.config.ts.old** - Original Vite config with API proxy and `/gold` base path
- **vercel.json.old** - Original Vercel config with API rewrite rules
- **App.tsx.old** - Original App component (for reference)

## What Changed

The static conversion (commit `35e8f62`) made these key changes:

1. **sections.ts**: Changed from fetching API to loading static JSON file
2. **vite.config.ts**: Removed API proxy and `/gold` base path
3. **vercel.json**: Removed API rewrite rules

## Restoring Old Behavior

If you need to restore the API-based behavior:

```bash
# Restore individual files
cp old_code/sections.ts.old frontend/src/api/sections.ts
cp old_code/vite.config.ts.old frontend/vite.config.ts
cp old_code/vercel.json.old frontend/vercel.json

# Or checkout the entire commit
git checkout 186bc91
```

## Git History

- `186bc91` - Last commit before static conversion
- `35e8f62` - Static conversion commit
- `69ecb50` - Current HEAD

To see the full diff:
```bash
git diff 186bc91 35e8f62
```
