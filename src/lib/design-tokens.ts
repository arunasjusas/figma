/**
 * Design Tokens for Invoicing SaaS Application
 * 
 * Centralized design system tokens following the Figma design specifications.
 * All colors, typography, spacing, and other design constants are defined here.
 */

export const colors = {
  // Primary colors
  primary: {
    default: '#0A61C4',
    hover: '#084FA3',
  },
  
  // Status colors
  status: {
    paid: '#10B981',      // Green - Sumokėtos
    unpaid: '#EF4444',    // Red - Neapmokėtos
    pending: '#0A61C4',   // Blue - Terminas nepasibaigęs
  },
  
  // Chart colors
  chart: {
    green: '#12E100',     // Sumokėtos line
    purple: '#664DFF',    // Nesumokėtos line
    blue: '#2B66FF',      // Terminas nepasibaigęs line
  },
  
  // Neutral colors
  neutral: {
    bg: '#F9FAFB',        // App background
    border: '#E5E7EB',    // Card borders
    borderDark: '#D1D5DB', // Darker borders
    white: '#FFFFFF',
  },
  
  // Pill/badge colors
  pill: {
    bg: '#EEF6FF',        // Light blue background for "Šį mėnesį"
    text: '#075985',      // Dark blue text
  },
  
  // Text colors
  text: {
    primary: '#111827',
    secondary: 'rgba(0,0,0,0.7)',
  },
} as const;

export const typography = {
  // Font families
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  
  // Font sizes
  fontSize: {
    pageTitle: '36px',      // "Sąskaitų statistika"
    sectionTitle: '20px',   // "Gautos pajamos", "Sąskaitų sąrašas"
    kpiNumber: '18px',      // "€ 12 430"
    tableHeader: '14px',    // Table headers
    body: '14px',           // Body text
    label: '12px',          // Small labels
  },
  
  // Font weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  // Card padding
  cardPadding: {
    sm: '16px',
    md: '20px',
    lg: '24px',
  },
  
  // Layout widths
  layout: {
    maxWidth: '1400px',
    sidebarWidth: '240px',
  },
  
  // Border radius
  radius: {
    button: '6px',
    card: '14px',
    pill: '999px',
    input: '4px',
  },
} as const;

export const shadows = {
  header: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)',
  card: '0 1px 2px rgba(0,0,0,0.05)',
} as const;

export const breakpoints = {
  mobile: '768px',
  desktop: '1024px',
} as const;

