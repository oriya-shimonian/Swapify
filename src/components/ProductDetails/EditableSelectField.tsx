// קובץ: components/EditableSelectField.tsx
import React from "react";

interface Option {
  label: string;
  value: string;
}

interface EditableSelectFieldProps {
  isEditing: boolean;
  value: string;
  onChange?: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

const EditableSelectField = ({
  isEditing,
  value,
  onChange,
  options,
  className = "",
  placeholder,
}: EditableSelectFieldProps) => {
  if (!isEditing) {
    const selected = options.find((opt) => opt.value === value);
    return <p className={`font-normal text-gray-800 ${className}`}>{selected?.label || value}</p>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`bg-white/80 border rounded-xl p-3 ${className}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default EditableSelectField;
