import { z } from 'zod'
export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: 'Identifier must be at least 3 characters long' })
    .max(50)
    .refine((value) => value.trim() !== '', {
      message: 'Identifier is required and cannot contain blank spaces',
    }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .max(100)
    .refine((value) => !/\s/.test(value), {
      message: 'Password cannot contain blank spaces',
    }),
});
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});
export const currencySchema = z
  .number()
  .refine((value) => typeof value === 'number', {
    message: 'Input must be a number',
  });
