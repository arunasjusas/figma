# How to Revert Delete & Recycle Bin Feature

If you want to remove the delete functionality and recycle bin feature, follow these steps:

## Option 1: Quick Revert via Git

```bash
# Revert to the commit before delete feature
git revert HEAD

# Or reset to previous commit
git reset --hard HEAD~1
git push origin main --force
```

## Option 2: Manual Removal

### 1. Remove Recycle Bin Page

**Delete file:**
```
src/features/invoices/pages/RecycleBinPage.tsx
```

### 2. Remove Recycle Bin Route

**Edit:** `src/App.tsx`

**Remove these lines:**
```typescript
const RecycleBinPage = lazy(() => import('./features/invoices/pages/RecycleBinPage'));
```

And:
```typescript
<Route
  path="recycle-bin"
  element={
    <Suspense fallback={<LoadingFallback />}>
      <RecycleBinPage />
    </Suspense>
  }
/>
```

### 3. Remove from Sidebar

**Edit:** `src/components/layout/Sidebar.tsx`

**Remove from imports:**
```typescript
Trash2
```

**Remove from nav items:**
```typescript
{ label: 'Šiukšliadėžė', path: '/recycle-bin', icon: <Trash2 className="w-5 h-5" /> },
```

### 4. Remove Delete Buttons from InvoicesTable

**Edit:** `src/features/invoices/components/InvoicesTable.tsx`

**Remove from imports:**
```typescript
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
```

**Remove these lines:**
```typescript
const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
const [deletingId, setDeletingId] = useState<string | null>(null);

const handleDelete = (id: string, invoiceNumber: string) => {
  if (window.confirm(`Ar tikrai norite ištrinti sąskaitą ${invoiceNumber}?`)) {
    setDeletingId(id);
    setTimeout(() => {
      deleteInvoice(id);
      setDeletingId(null);
    }, 300);
  }
};
```

**Change:**
```typescript
const invoices = getActiveInvoices();
```
**To:**
```typescript
const invoices = useInvoiceStore((state) => state.invoices);
```

**Remove delete buttons from both mobile and desktop views**

### 5. Remove Delete Button from InvoiceDetailPage

**Edit:** `src/features/invoices/pages/InvoiceDetailPage.tsx`

**Remove from imports:**
```typescript
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
```

**Remove these lines:**
```typescript
const navigate = useNavigate();
const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

const handleDelete = () => {
  if (invoice && window.confirm(`Ar tikrai norite ištrinti sąskaitą ${invoice.number}?`)) {
    deleteInvoice(invoice.id);
    navigate('/invoices');
  }
};
```

**Remove the delete button from the actions section**

### 6. Simplify Invoice Store (Optional)

**Edit:** `src/store/invoiceStore.ts`

If you want to go back to hard delete instead of soft delete:

**Change:**
```typescript
deleteInvoice: (id) => {
  set((state) => ({
    invoices: state.invoices.map((invoice) =>
      invoice.id === id
        ? { ...invoice, deleted: true, deletedAt: new Date().toISOString() }
        : invoice
    ),
  }));
},
```

**To:**
```typescript
deleteInvoice: (id) => {
  set((state) => ({
    invoices: state.invoices.filter((invoice) => invoice.id !== id),
  }));
},
```

**And remove these methods:**
```typescript
restoreInvoice: (id: string) => void;
permanentlyDeleteInvoice: (id: string) => void;
getActiveInvoices: () => Invoice[];
getDeletedInvoices: () => Invoice[];
```

### 7. Remove Soft Delete Fields from Invoice Interface (Optional)

**Edit:** `src/lib/mockData.ts`

**Remove these fields:**
```typescript
deleted?: boolean;
deletedAt?: string;
```

## After Making Changes

1. Test the app: `npm run dev`
2. Build: `npm run build`
3. Commit: `git add . && git commit -m "revert: remove delete and recycle bin feature"`
4. Push: `git push origin main`

---

**Current Features:**
- ✅ Delete buttons on invoice list and detail pages
- ✅ Soft delete (invoices marked as deleted, not removed)
- ✅ Recycle Bin page to view deleted invoices
- ✅ Restore deleted invoices
- ✅ Permanently delete invoices
- ✅ Confirmation dialogs for all delete actions

**After Revert:**
- ❌ No delete functionality
- ❌ No recycle bin
- ❌ Invoices cannot be removed

