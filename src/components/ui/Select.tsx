import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/design-tokens';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

/**
 * Select dropdown component with smooth animations and better styling
 * Styled to match the design system
 */
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Pasirinkite...',
  required = false,
  error,
  fullWidth = false,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Get status color for status options
  const getStatusColor = (optionValue: string): string | null => {
    if (optionValue === 'PAID' || optionValue === 'paid') return colors.status.paid;
    if (optionValue === 'UNPAID' || optionValue === 'unpaid') return colors.status.unpaid;
    if (optionValue === 'PENDING' || optionValue === 'pending') return colors.status.pending;
    return null;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
        setHighlightedIndex(-1);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return (
    <div className={cn('relative', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5 pr-10',
            'bg-white border rounded-lg',
            'text-sm font-medium',
            'flex items-center justify-between',
            'transition-all duration-200 ease-in-out',
            'focus:outline-none focus:ring-2 focus:ring-opacity-50',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500 text-red-900'
              : 'border-neutral-border focus:border-primary focus:ring-primary text-gray-900',
            disabled
              ? 'bg-gray-100 cursor-not-allowed opacity-60'
              : 'hover:border-gray-400 cursor-pointer shadow-sm hover:shadow',
            !selectedOption && 'text-gray-500'
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2',
              isOpen && 'transform rotate-180',
              error ? 'text-red-500' : 'text-gray-400'
            )}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-neutral-border rounded-lg shadow-lg overflow-hidden dropdown-fade-in"
            style={{ 
              maxHeight: options.length <= 4 ? 'none' : '240px',
              overflowY: options.length <= 4 ? 'visible' : 'auto'
            }}
          >
            {options.map((option, index) => {
              const statusColor = getStatusColor(option.value);
              const isHighlighted = index === highlightedIndex;
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm',
                    'transition-colors duration-150',
                    'flex items-center gap-2',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : isHighlighted
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {statusColor && (
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: statusColor }}
                    />
                  )}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && (
                    <span className="text-primary font-semibold">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}

