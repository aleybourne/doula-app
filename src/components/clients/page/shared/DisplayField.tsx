
import React from 'react';

interface DisplayFieldProps {
  label: string;
  value: string | undefined | boolean;
}

export const DisplayField = ({ label, value }: DisplayFieldProps) => {
  let displayValue: string;
  
  if (value === undefined || value === null) {
    displayValue = "Not provided";
  } else if (typeof value === 'boolean') {
    displayValue = value ? "Yes" : "No";
  } else {
    displayValue = value;
  }
  
  return (
    <div className="py-1">
      <span className="text-sm font-medium text-gray-500">{label}:</span>{" "}
      <span className="text-sm">{displayValue}</span>
    </div>
  );
};
