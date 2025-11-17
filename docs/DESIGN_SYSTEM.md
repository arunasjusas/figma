# Design System Documentation

Complete design system reference for the Invoicing & AI Reminders SaaS application.

## 🎨 Color Palette

### Primary Colors

```typescript
primary: {
  default: '#0A61C4',  // Main brand color
  hover: '#084FA3',    // Hover state
}
```

**Usage**: Primary buttons, active navigation items, links, headings

### Status Colors

```typescript
status: {
  paid: '#10B981',      // Green - Sumokėtos (Paid)
  unpaid: '#EF4444',    // Red - Neapmokėtos (Unpaid)
  pending: '#0A61C4',   // Blue - Terminas nepasibaigęs (Pending)
}
```

**Usage**: Invoice status pills, status indicators

### Chart Colors

```typescript
chart: {
  green: '#12E100',     // Sumokėtos line
  purple: '#664DFF',    // Nesumokėtos line
  blue: '#2B66FF',      // Terminas nepasibaigęs line
}
```

**Usage**: Line charts, data visualization

### Neutral Colors

```typescript
neutral: {
  bg: '#F9FAFB',        // App background
  border: '#E5E7EB',    // Card borders
  borderDark: '#D1D5DB', // Darker borders
  white: '#FFFFFF',     // Card backgrounds
}
```

**Usage**: Backgrounds, borders, dividers

### Pill/Badge Colors

```typescript
pill: {
  bg: '#EEF6FF',        // Light blue background
  text: '#075985',      // Dark blue text
}
```

**Usage**: "Šį mėnesį" label, informational badges

### Text Colors

```typescript
text: {
  primary: '#111827',           // Main text
  secondary: 'rgba(0,0,0,0.7)', // Secondary text, labels
}
```

## 📝 Typography

### Font Family

```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Font Sizes

| Element | Size | Usage |
|---------|------|-------|
| Page Title | 36px | "Sąskaitų statistika" |
| Section Title | 20px | "Gautos pajamos", "Sąskaitų sąrašas" |
| KPI Number | 18px | "€ 12 430" |
| Table Header | 14px | Column headers |
| Body Text | 14px | Regular content |
| Label | 12px | Small labels, hints |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, numbers |
| Medium | 500 | Labels, secondary headings |
| SemiBold | 600 | Table headers, emphasis |
| Bold | 700 | Page titles, section titles |

### Typography Examples

```tsx
// Page title
<h1 className="text-4xl font-bold text-primary">
  Sąskaitų statistika
</h1>

// Section title
<h2 className="text-lg font-bold text-gray-900">
  Gautos pajamos
</h2>

// Body text
<p className="text-sm text-gray-700">
  Regular content text
</p>

// Label
<label className="text-xs font-medium text-gray-600">
  Small label
</label>
```

## 📐 Spacing & Layout

### Container Widths

```typescript
layout: {
  maxWidth: '1400px',    // Max content width
  sidebarWidth: '240px', // Fixed sidebar width
}
```

### Card Padding

```typescript
cardPadding: {
  sm: '16px',  // Small cards
  md: '20px',  // Medium cards (default)
  lg: '24px',  // Large cards
}
```

### Border Radius

```typescript
radius: {
  button: '6px',   // Buttons and inputs
  card: '14px',    // Cards
  pill: '999px',   // Pills and badges
  input: '4px',    // Input fields
}
```

### Spacing Scale

Use Tailwind's spacing scale:
- `gap-3` (12px) - Between small elements
- `gap-4` (16px) - Between medium elements
- `gap-6` (24px) - Between large sections
- `p-4` (16px) - Small padding
- `p-5` (20px) - Medium padding
- `p-6` (24px) - Large padding

## 🎭 Shadows

### Header Shadow

```css
box-shadow: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
```

**Usage**: Top navigation bar

### Card Shadow (Optional)

```css
box-shadow: 0 1px 2px rgba(0,0,0,0.05);
```

**Usage**: Subtle elevation for cards

## 🧩 Component Specifications

### Buttons

#### Primary Button
```tsx
<Button variant="primary">
  Nauja sąskaita
</Button>
```
- Background: `#0A61C4`
- Text: White
- Hover: White background with `#0A61C4` border and blue text
- Padding: `h-10 px-4` (medium)
- Border radius: `6px`

#### Secondary Button
```tsx
<Button variant="secondary">
  Pridėti klientą
</Button>
```
- Background: Light gray (`#F3F4F6`)
- Text: `#111827`
- Hover: White background with `#E5E7EB` border
- Border radius: `6px`

#### Outline Button
```tsx
<Button variant="outline">
  Filtruoti
</Button>
```
- Background: Transparent
- Border: Primary color
- Text: Primary color
- Hover: Primary color with 10% opacity

### Input Fields

```tsx
<Input
  label="El. paštas"
  type="email"
  placeholder="vardas@pavyzdys.lt"
/>
```

- Height: `40px`
- Border: `#E5E7EB`
- Border radius: `4px`
- Focus: 2px primary ring
- Label: 12-14px, medium weight

### Cards

```tsx
<Card padding="md">
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

- Background: White
- Border: `#E5E7EB`
- Border radius: `14px`
- Padding: 16-24px

### Pills/Badges

```tsx
// Status pills
<Pill variant="paid">Apmokėta</Pill>
<Pill variant="unpaid">Neapmokėta</Pill>
<Pill variant="pending">Terminas nepasibaigęs</Pill>

// Info pill
<Pill variant="default">Šį mėnesį</Pill>
```

- Fully rounded (`border-radius: 999px`)
- Padding: `px-3 py-1`
- Font size: `12px`
- Font weight: Medium

### Tables

#### Desktop Table
- Border between rows: `#E5E7EB`
- Header: 12px uppercase, semibold
- Cell padding: `16px`
- Hover: Light gray background

#### Mobile Cards
On mobile (`< 768px`), tables transform to cards:
- Each row becomes a card
- Labels shown inline
- Full-width layout
- Vertical spacing between cards

## 📱 Responsive Breakpoints

```typescript
breakpoints: {
  mobile: '768px',   // Below this: mobile layout
  desktop: '1024px', // Above this: full desktop layout
}
```

### Responsive Behavior

#### Sidebar
- Desktop: Fixed left sidebar (240px)
- Mobile: Hamburger menu with overlay

#### Grid Layouts
```tsx
// KPI Cards
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Form Fields
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

#### Typography
```tsx
// Page title
<h1 className="text-2xl md:text-4xl font-bold">
```

## 🎯 Usage Guidelines

### Do's ✅

- Use design tokens from `src/lib/design-tokens.ts`
- Follow Tailwind utility classes
- Maintain consistent spacing (multiples of 4px)
- Use semantic color names (primary, status.paid, etc.)
- Keep mobile-first approach
- Use Inter font family

### Don'ts ❌

- Don't use arbitrary color values
- Don't mix px values with Tailwind classes
- Don't use absolute positioning for layout
- Don't create custom spacing values
- Don't use inline styles
- Don't skip responsive considerations

## 🔍 Accessibility

### Color Contrast

All color combinations meet WCAG AA standards:
- Primary blue on white: 4.5:1
- Text on backgrounds: 7:1+
- Status colors on white: 3:1+

### Focus States

All interactive elements have visible focus states:
```tsx
focus:outline-none focus:ring-2 focus:ring-primary
```

### Semantic HTML

- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for actions
- Use `<a>` for navigation
- Use `<label>` for form fields

## 📊 Chart Styling

### Line Chart Configuration

```tsx
<LineChart
  data={chartData}
  lines={[
    { dataKey: 'paid', name: 'Sumokėtos', color: '#12E100' },
    { dataKey: 'unpaid', name: 'Nesumokėtos', color: '#664DFF' },
    { dataKey: 'pending', name: 'Terminas Nepasibaigęs', color: '#2B66FF' },
  ]}
/>
```

- Grid: Dashed lines, low opacity
- Axis: Gray text, 12px
- Lines: 2px stroke width
- Dots: 4px radius
- Active dots: 6px radius

## 🌍 Lithuanian Text

All user-facing text must be in Lithuanian:

### Common Terms
- Sąskaitos - Invoices
- Peržiūra - Overview/Dashboard
- Nustatymai - Settings
- Išsaugoti - Save
- Atšaukti - Cancel
- Filtruoti - Filter
- Paieška - Search

### Status Labels
- Apmokėta - Paid
- Neapmokėta - Unpaid
- Terminas nepasibaigęs - Term not expired

See `src/lib/constants.ts` for complete label mappings.

