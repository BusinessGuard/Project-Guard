/**
 * Validates that a number input value is >= 0
 * Allows empty string for clearing the field
 * @param value - The input value as string
 * @returns true if value is empty or >= 0, false otherwise
 */
export function isValidNonNegativeNumber(value: string): boolean {
  if (value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
}

/**
 * Validates that a number input value is > 0
 * Allows empty string for clearing the field
 * @param value - The input value as string
 * @returns true if value is empty or > 0, false otherwise
 */
export function isValidPositiveNumber(value: string): boolean {
  if (value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validates that a number input value is within a range [min, max]
 * Allows empty string for clearing the field
 * @param value - The input value as string
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns true if value is empty or within range, false otherwise
 */
export function isValidNumberInRange(value: string, min: number, max: number): boolean {
  if (value === '') return true;
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Creates an onChange handler for number inputs that validates >= 0
 * @param setValue - State setter function
 * @returns onChange handler function
 */
export function createNonNegativeNumberHandler(
  setValue: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNonNegativeNumber(value)) {
      setValue(value);
    }
  };
}

/**
 * Creates an onChange handler for number inputs that validates > 0
 * @param setValue - State setter function
 * @returns onChange handler function
 */
export function createPositiveNumberHandler(
  setValue: (value: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidPositiveNumber(value)) {
      setValue(value);
    }
  };
}

/**
 * Creates an onChange handler for number inputs that validates within range
 * @param setValue - State setter function
 * @param min - Minimum allowed value (inclusive)
 * @param max - Maximum allowed value (inclusive)
 * @returns onChange handler function
 */
export function createRangeNumberHandler(
  setValue: (value: string) => void,
  min: number,
  max: number
): (e: React.ChangeEvent<HTMLInputElement>) => void {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNumberInRange(value, min, max)) {
      setValue(value);
    }
  };
}

/**
 * Validates and updates a number value with a custom update function
 * @param value - The input value as string
 * @param updateFn - Function to call with parsed number if valid
 */
export function handleNonNegativeNumberInput(
  value: string,
  updateFn: (num: number) => void
): void {
  if (isValidNonNegativeNumber(value)) {
    updateFn(parseFloat(value) || 0);
  }
}
