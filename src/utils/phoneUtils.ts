/**
 * Sanitizes a phone number by removing all non-digit characters
 */
export const sanitizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

/**
 * Formats a phone number based on its length
 * Handles both local and international formats
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = sanitizePhoneNumber(phoneNumber);
  
  // No formatting for very short numbers
  if (cleaned.length <= 3) {
    return cleaned;
  }

  // Split number into groups of 2-3-4 or 3-3-4 depending on length
  const parts: string[] = [];
  let remaining = cleaned;

  // Handle different length patterns
  if (cleaned.length <= 7) {
    // xx-xxxx or xxx-xxxx
    parts.push(remaining.slice(0, remaining.length - 4));
    remaining = remaining.slice(remaining.length - 4);
    parts.push(remaining);
  } else if (cleaned.length <= 10) {
    // xxx-xxx-xxxx
    parts.push(remaining.slice(0, 3));
    remaining = remaining.slice(3);
    parts.push(remaining.slice(0, 3));
    remaining = remaining.slice(3);
    parts.push(remaining);
  } else {
    // Handle longer international numbers
    while (remaining.length > 0) {
      if (remaining.length > 4) {
        parts.push(remaining.slice(0, 3));
        remaining = remaining.slice(3);
      } else {
        parts.push(remaining);
        remaining = '';
      }
    }
  }

  return parts.join(' ');
};

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a phone number with specific error messages
 */
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  const cleaned = sanitizePhoneNumber(phoneNumber);
  
  if (cleaned.length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (cleaned.length < 7) {
    return { isValid: false, error: 'Phone number is too short' };
  }
  
  if (cleaned.length > 15) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  // Check for obviously invalid patterns (all same digit, sequential numbers)
  if (/^(.)\1+$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid phone number pattern' };
  }

  if (/^(0{7,}|1{7,}|2{7,}|3{7,}|4{7,}|5{7,}|6{7,}|7{7,}|8{7,}|9{7,})$/.test(cleaned)) {
    return { isValid: false, error: 'Invalid phone number pattern' };
  }

  return { isValid: true };
};

/**
 * Simple validation for backward compatibility
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  return validatePhoneNumber(phoneNumber).isValid;
};

/**
 * Applies input masking to a phone number as it's being typed
 * @param value Current input value
 * @param prevValue Previous input value
 * @returns Masked phone number
 */
export const maskPhoneNumber = (value: string, prevValue: string): string => {
  const digits = sanitizePhoneNumber(value);
  const oldDigits = sanitizePhoneNumber(prevValue);
  
  // Handle backspace
  if (digits.length < oldDigits.length) {
    return formatPhoneNumber(digits);
  }

  // Limit the length
  if (digits.length > 15) {
    return formatPhoneNumber(oldDigits);
  }

  return formatPhoneNumber(digits);
};

/**
 * Gets the cursor position after applying the mask
 */
export const getNextCursorPosition = (
  value: string,
  prevValue: string,
  currentCursor: number
): number => {
  const cleaned = sanitizePhoneNumber(value);
  const formatted = formatPhoneNumber(cleaned);
  
  // If deleting, move cursor back
  if (value.length < prevValue.length) {
    return currentCursor - 1;
  }
  
  // If typing, move cursor forward accounting for spaces
  const spacesBeforeCursor = formatted
    .slice(0, currentCursor)
    .split('')
    .filter(char => char === ' ').length;
    
  return Math.min(currentCursor + spacesBeforeCursor, formatted.length);
};