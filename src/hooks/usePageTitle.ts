import { useEffect } from 'react';

/**
 * Custom hook to set the page title dynamically
 * This allows each page to set its own title in the TopBar
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    // Store the title in a global location that TopBar can read
    window.document.title = `${title} - Sąskaitų Sistema`;
    
    // Dispatch custom event for TopBar to listen to
    window.dispatchEvent(new CustomEvent('page-title-change', { detail: title }));
  }, [title]);
}

