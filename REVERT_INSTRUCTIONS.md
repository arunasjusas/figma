# How to Revert Action Buttons to Show on All Pages

If you want the "Nauja sąskaita" and "Pridėti klientą" buttons to appear on ALL pages again (not just the Invoices page), follow these steps:

## Option 1: Quick Revert via Git

```bash
# Revert to the previous commit (before conditional buttons)
git revert HEAD

# Or reset to the previous commit
git reset --hard HEAD~1
git push origin main --force
```

## Option 2: Manual Code Change

Edit the file: `src/components/layout/TopBar.tsx`

### Find this line (around line 26):
```typescript
const shouldShowActions = showActions && location.pathname === '/invoices';
```

### Replace it with:
```typescript
const shouldShowActions = showActions;
```

### Also find this line (around line 53):
```typescript
{shouldShowActions && (
```

### Replace it with:
```typescript
{showActions && (
```

### Optional: Remove the unused import
If you made the changes above, you can also remove `useLocation` from the imports at the top:

Change:
```typescript
import { useNavigate, useLocation } from 'react-router-dom';
```

To:
```typescript
import { useNavigate } from 'react-router-dom';
```

And remove this line:
```typescript
const location = useLocation();
```

## After Making Changes

1. Test the app: `npm run dev`
2. Build: `npm run build`
3. Commit: `git add . && git commit -m "revert: show action buttons on all pages"`
4. Push: `git push origin main`

---

**Current Behavior**: Buttons show ONLY on `/invoices` page  
**After Revert**: Buttons show on ALL pages

