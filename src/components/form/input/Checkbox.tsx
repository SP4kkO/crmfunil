import React from "react";

interface CheckboxProps {
  label?: string; // Optional label for the checkbox
  checked: boolean; // Checked state
  className?: string;
  id?: string; // Unique ID for the checkbox
  onChange: (checked: boolean) => void; // Change handler
  disabled?: boolean; // Disabled state
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  id,
  onChange,
  className = "",
  disabled = false,
}) => {
  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer ${
        disabled ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      <input
        id={id}
        type="checkbox"
        className={`w-4 h-4 border-gray-300 rounded text-brand-500 focus:ring-2 focus:ring-brand-500 focus:outline-none 
          dark:bg-gray-800 dark:border-gray-600 dark:checked:bg-brand-500 dark:checked:border-brand-500
          disabled:cursor-not-allowed disabled:opacity-60
          ${className}`}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {label && (
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
