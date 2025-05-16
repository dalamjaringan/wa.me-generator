import React, { ChangeEvent, useRef, useState } from 'react';
import { maskPhoneNumber, getNextCursorPosition } from '../utils/phoneUtils';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Phone number",
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [prevValue, setPrevValue] = useState(value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const cursorStart = input.selectionStart || 0;
    const newValue = maskPhoneNumber(input.value, prevValue);
    
    // Update the input value
    onChange(newValue);
    setPrevValue(newValue);

    // Set cursor position after React updates the input
    requestAnimationFrame(() => {
      if (inputRef.current) {
        const nextCursor = getNextCursorPosition(newValue, prevValue, cursorStart);
        inputRef.current.selectionStart = nextCursor;
        inputRef.current.selectionEnd = nextCursor;
      }
    });
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        id="phone-number"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`text-input ${error ? 'text-input--error' : value ? 'text-input--success' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? "phone-error" : undefined}
        inputMode="numeric"
        autoComplete="tel"
      />
      {error && (
        <>
          <div id="phone-error" className="sr-only" role="alert">
            {error}
          </div>
          <p className="mt-1 text-sm text-red-500" aria-hidden="true">
            {error}
          </p>
        </>
      )}
    </div>
  );
};