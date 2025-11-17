# Revert Color Palette Changes

This document provides instructions to revert the color palette changes made in commit `0c9100c`.

## Changes Made

1. **Primary Button Hover State**: Changed from darker blue background to white background with blue border
2. **Secondary Button Normal State**: Changed from white with border to light gray background
3. **Design System Documentation**: Updated to reflect new button states

## Files Modified

- `src/components/ui/Button.tsx`
- `docs/DESIGN_SYSTEM.md`

## Revert Options

### Option 1: Revert the Commit (Recommended)

```powershell
cd figma
git checkout main
git revert 0c9100c
git push origin main
```

### Option 2: Reset to Previous State

```powershell
cd figma
git checkout main
git reset --hard HEAD~1  # Only if you haven't pushed to main yet
```

### Option 3: Restore from Backup Branch

A backup branch was created: `backup/color-palette-20251117-100500`

```powershell
cd figma
git checkout main
git checkout backup/color-palette-20251117-100500 -- src/components/ui/Button.tsx docs/DESIGN_SYSTEM.md
git commit -m "revert: restore previous button color palette"
git push origin main
```

## Manual Revert

If you prefer to manually revert:

### Button.tsx Changes

**Primary button hover** - Change from:
```tsx
'bg-primary text-white hover:bg-white hover:text-primary hover:border hover:border-primary'
```

Back to:
```tsx
'bg-primary text-white hover:bg-primary-hover'
```

**Secondary button normal** - Change from:
```tsx
'bg-gray-100 text-gray-900 hover:bg-white hover:border hover:border-neutral-border'
```

Back to:
```tsx
'bg-white text-gray-900 border border-neutral-border hover:bg-gray-50'
```

### DESIGN_SYSTEM.md Changes

Restore the previous button documentation sections to match the old behavior.

## Current Branch

The changes are on branch: `feat/update-color-palette`

If you want to discard this branch entirely:
```powershell
cd figma
git checkout main
git branch -D feat/update-color-palette
git push origin --delete feat/update-color-palette
```

