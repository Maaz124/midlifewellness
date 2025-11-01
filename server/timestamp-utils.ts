/**
 * Normalizes timestamp values to Date objects for Drizzle ORM
 * Drizzle timestamp columns require Date objects, not strings or numbers
 */

export function normalizeTimestamp(value: string | number | Date | null | undefined): Date {
  if (!value) {
    return new Date();
  }
  
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error(`Invalid Date object: ${value}`);
    }
    return value;
  }
  
  if (typeof value === 'number') {
    // Reject numeric timestamps - require ISO strings
    throw new Error(`Numeric timestamps are not allowed. Expected ISO string but received: ${value}. Use new Date().toISOString() instead.`);
  }
  
  if (typeof value === 'string') {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(`Invalid date string: "${value}". Expected ISO format (e.g., "2025-11-01T12:00:00.000Z")`);
    }
    return date;
  }
  
  throw new Error(`Unsupported timestamp type: ${typeof value}. Expected Date, string (ISO), or undefined.`);
}

/**
 * Normalizes all timestamp fields in an object
 */
export function normalizeTimestamps<T extends Record<string, any>>(
  data: T,
  timestampFields: string[] = ['createdAt', 'updatedAt', 'completedAt', 'targetDate', 'lastCompleted']
): T {
  const normalized = { ...data };
  
  for (const field of timestampFields) {
    if (field in normalized && normalized[field] !== undefined) {
      try {
        normalized[field] = normalizeTimestamp(normalized[field]);
      } catch (error: any) {
        throw new Error(`Invalid ${field}: ${error.message}`);
      }
    }
  }
  
  return normalized;
}

