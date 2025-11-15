interface TextareaProps {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  rows?: number;
  disabled?: boolean;
}

/**
 * Textarea component
 * Styled to match the design system
 */
export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  fullWidth = false,
  rows = 4,
  disabled = false,
}: TextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-4 py-2.5
          bg-white border rounded-lg
          text-gray-900 text-sm
          transition-colors resize-y
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          placeholder:text-gray-400
        `}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

