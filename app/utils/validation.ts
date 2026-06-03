import type { z } from 'zod'

export type ValidationErrors<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>

export type ValidationResult<T extends Record<string, unknown>> =
  | {
      success: true
      data: T
      errors: ValidationErrors<T>
    }
  | {
      success: false
      data: null
      errors: ValidationErrors<T>
    }

export function validateSchema<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  values: T,
): ValidationResult<T> {
  const parsed = schema.safeParse(values)

  if (parsed.success) {
    return {
      success: true,
      data: parsed.data,
      errors: {},
    }
  }

  const fieldErrors = parsed.error.flatten().fieldErrors
  const errors = Object.entries(fieldErrors).reduce<ValidationErrors<T>>((acc, [key, value]) => {
    acc[key as keyof T] = value?.[0] ?? ''
    return acc
  }, {})

  return {
    success: false,
    data: null,
    errors,
  }
}
