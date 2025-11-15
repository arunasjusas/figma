import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format currency in EUR
 */
export function formatCurrency(amount: number): string {
  return `€ ${amount.toLocaleString('lt-LT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Format date in Lithuanian format
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('lt-LT');
}

/**
 * Get Lithuanian month name
 */
export function getMonthName(monthIndex: number): string {
  const months = [
    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 
    'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis',
    'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
  ];
  return months[monthIndex] || '';
}

/**
 * Get all Lithuanian month names
 */
export function getAllMonthNames(): string[] {
  return [
    'Sausis', 'Vasaris', 'Kovas', 'Balandis', 
    'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis',
    'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'
  ];
}

