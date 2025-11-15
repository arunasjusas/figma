# Component Documentation

Complete API reference for all reusable components in the application.

## 📦 Base UI Components

### Button

Versatile button component with multiple variants and sizes.

**Location**: `src/components/ui/Button.tsx`

#### Props

```typescript
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}
```

#### Usage

```tsx
import { Button } from '@/components/ui/Button';

// Primary button
<Button variant="primary" size="md">
  Nauja sąskaita
</Button>

// Outline button
<Button variant="outline" size="sm">
  Filtruoti
</Button>

// With icon
<Button variant="primary">
  <Plus className="w-4 h-4 mr-2" />
  Pridėti
</Button>
```

#### Variants

- **primary**: Blue background, white text (main actions)
- **secondary**: White background, gray border (secondary actions)
- **outline**: Transparent background, primary border (tertiary actions)
- **ghost**: No background or border (subtle actions)

#### Sizes

- **sm**: Height 32px, padding 12px
- **md**: Height 40px, padding 16px (default)
- **lg**: Height 48px, padding 24px

---

### Input

Input field with label and error support.

**Location**: `src/components/ui/Input.tsx`

#### Props

```typescript
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

#### Usage

```tsx
import { Input } from '@/components/ui/Input';

<Input
  label="El. paštas"
  type="email"
  placeholder="vardas@pavyzdys.lt"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
  required
/>
```

#### Features

- Automatic label association
- Error message display
- Focus ring styling
- Disabled state support

---

### Card

Container component for content sections.

**Location**: `src/components/ui/Card.tsx`

#### Props

```typescript
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}
```

#### Usage

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card padding="md">
  <CardHeader>
    <CardTitle>Sąskaitų sąrašas</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>
```

#### Sub-components

- **CardHeader**: Container for card header
- **CardTitle**: Styled heading for card
- **CardContent**: Main content area

---

### Pill

Badge/pill component for status indicators and labels.

**Location**: `src/components/ui/Pill.tsx`

#### Props

```typescript
interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'paid' | 'unpaid' | 'pending';
}
```

#### Usage

```tsx
import { Pill } from '@/components/ui/Pill';

<Pill variant="paid">Apmokėta</Pill>
<Pill variant="unpaid">Neapmokėta</Pill>
<Pill variant="pending">Terminas nepasibaigęs</Pill>
<Pill variant="default">Šį mėnesį</Pill>
```

---

### Table

Table components for data display.

**Location**: `src/components/ui/Table.tsx`

#### Components

- `Table`: Main table wrapper
- `TableHeader`: Table header section
- `TableBody`: Table body section
- `TableRow`: Table row
- `TableHead`: Table header cell
- `TableCell`: Table data cell

#### Usage

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nr.</TableHead>
      <TableHead>Data</TableHead>
      <TableHead>Suma</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>SF-101</TableCell>
      <TableCell>2025-10-01</TableCell>
      <TableCell>€ 250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 🎯 Shared Components

### KpiCard

KPI metric card for dashboard.

**Location**: `src/components/shared/KpiCard.tsx`

#### Props

```typescript
interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  label?: string;
  className?: string;
}
```

#### Usage

```tsx
import { KpiCard } from '@/components/shared/KpiCard';

<KpiCard
  label="Šį mėnesį"
  title="Gautos pajamos"
  value="€ 12 430"
/>

<KpiCard
  title="Neapmokėta"
  subtitle="Vėluojančios sąskaitos"
  value="8 vnt. · € 3 210"
/>
```

---

### InvoiceStatusPill

Specialized pill for invoice status display.

**Location**: `src/components/shared/InvoiceStatusPill.tsx`

#### Props

```typescript
interface InvoiceStatusPillProps {
  status: 'PAID' | 'UNPAID' | 'PENDING';
}
```

#### Usage

```tsx
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';

<InvoiceStatusPill status="PAID" />
<InvoiceStatusPill status="UNPAID" />
<InvoiceStatusPill status="PENDING" />
```

---

### FileUploadArea

Drag-and-drop file upload component.

**Location**: `src/components/shared/FileUploadArea.tsx`

#### Props

```typescript
interface FileUploadAreaProps {
  onFilesSelected: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
}
```

#### Usage

```tsx
import { FileUploadArea } from '@/components/shared/FileUploadArea';

<FileUploadArea
  onFilesSelected={(files) => console.log(files)}
  accept=".csv,.xlsx,.xls"
  multiple={true}
/>
```

#### Features

- Drag-and-drop support
- File type filtering
- Multiple file selection
- File list with remove capability
- File type badges

---

## 🏗️ Layout Components

### Sidebar

Main navigation sidebar.

**Location**: `src/components/layout/Sidebar.tsx`

#### Features

- Active route highlighting
- Icon + label navigation items
- Beta badges for AI features
- Logout button
- Responsive (hidden on mobile)

#### Usage

```tsx
import { Sidebar } from '@/components/layout/Sidebar';

<Sidebar />
```

---

### TopBar

Top navigation bar with page title and actions.

**Location**: `src/components/layout/TopBar.tsx`

#### Props

```typescript
interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  showActions?: boolean;
}
```

#### Usage

```tsx
import { TopBar } from '@/components/layout/TopBar';

<TopBar
  title="Sąskaitų statistika"
  onMenuClick={() => setMenuOpen(true)}
  showActions={true}
/>
```

---

### AppLayout

Main application layout wrapper.

**Location**: `src/components/layout/AppLayout.tsx`

#### Props

```typescript
interface AppLayoutProps {
  pageTitle?: string;
  showActions?: boolean;
}
```

#### Usage

```tsx
import { AppLayout } from '@/components/layout/AppLayout';

// In routing
<Route path="/" element={<AppLayout />}>
  <Route path="dashboard" element={<DashboardPage />} />
</Route>
```

#### Features

- Automatic sidebar/topbar integration
- Mobile menu handling
- Responsive layout switching
- Outlet for nested routes

---

### MobileSidebar

Mobile version of sidebar with overlay.

**Location**: `src/components/layout/MobileSidebar.tsx`

#### Props

```typescript
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
```

#### Usage

```tsx
import { MobileSidebar } from '@/components/layout/MobileSidebar';

<MobileSidebar
  isOpen={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
/>
```

---

## 📊 Chart Components

### LineChart

Recharts-based line chart component.

**Location**: `src/components/charts/LineChart.tsx`

#### Props

```typescript
interface LineChartProps {
  data: Array<Record<string, string | number>>;
  lines: Array<{
    dataKey: string;
    name: string;
    color: string;
  }>;
  xAxisKey: string;
}
```

#### Usage

```tsx
import { LineChart } from '@/components/charts/LineChart';
import { colors } from '@/lib/design-tokens';

<LineChart
  data={chartData}
  lines={[
    { dataKey: 'paid', name: 'Sumokėtos', color: colors.chart.green },
    { dataKey: 'unpaid', name: 'Nesumokėtos', color: colors.chart.purple },
    { dataKey: 'pending', name: 'Terminas Nepasibaigęs', color: colors.chart.blue },
  ]}
  xAxisKey="month"
/>
```

#### Features

- Responsive container
- Customizable lines
- Grid lines
- Tooltip
- Legend
- Design system colors

---

## 🎨 Styling Guidelines

### Using Components with Tailwind

All components accept `className` prop for additional styling:

```tsx
<Button className="w-full mt-4" variant="primary">
  Submit
</Button>

<Card className="shadow-lg" padding="lg">
  Content
</Card>
```

### Composition Pattern

Components are designed to be composed:

```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Title</CardTitle>
      <Button variant="ghost" size="sm">Action</Button>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      {/* Table content */}
    </Table>
  </CardContent>
</Card>
```

---

## ♿ Accessibility

All components follow accessibility best practices:

- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Focus Indicators**: Visible focus rings on all focusable elements
- **ARIA Labels**: Proper ARIA attributes where needed
- **Semantic HTML**: Using correct HTML elements
- **Color Contrast**: WCAG AA compliant color combinations

---

## 📱 Responsive Behavior

### Automatic Responsiveness

Many components automatically adapt to screen size:

```tsx
// Button text hides on mobile
<Button variant="primary" size={isMobile ? 'sm' : 'md'}>
  <Plus className="w-4 h-4 mr-2" />
  {!isMobile && 'Nauja sąskaita'}
  {isMobile && 'Sąskaita'}
</Button>
```

### Using Media Query Hook

```tsx
import { useIsMobile, useIsDesktop } from '@/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div className={isMobile ? 'flex-col' : 'flex-row'}>
      {/* Content */}
    </div>
  );
}
```

---

## 🔧 Utility Functions

### cn() - Class Name Merger

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)}>
```

### formatCurrency()

```tsx
import { formatCurrency } from '@/lib/utils';

formatCurrency(1234.56) // "€ 1 234,56"
```

### formatDate()

```tsx
import { formatDate } from '@/lib/utils';

formatDate('2025-10-01') // "2025-10-01" (Lithuanian format)
```

---

## 🚀 Creating New Components

### Component Template

```tsx
import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface MyComponentProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'special';
  // Add custom props
}

/**
 * MyComponent - Brief description
 * 
 * @example
 * <MyComponent variant="special">Content</MyComponent>
 */
export const MyComponent = forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'base-classes',
          {
            'variant-classes': variant === 'special',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MyComponent.displayName = 'MyComponent';
```

### Best Practices

1. **TypeScript**: Always define prop interfaces
2. **forwardRef**: Use for DOM elements that might need refs
3. **className**: Always accept className for extensibility
4. **Documentation**: Add JSDoc comments
5. **Variants**: Use variant props for different styles
6. **Composition**: Design for composition over configuration

