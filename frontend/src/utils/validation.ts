import {z} from 'zod'
export const loginSchema = z.object({
    identifier: z.string().min(1).max(50),
    password: z.string().min(1).max(100),
  });
