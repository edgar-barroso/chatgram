import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be less than 50 characters')
})

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address')
    .min(1, 'Email is required'),
  password: z.string()
    .min(1, 'Password is required')
}) 