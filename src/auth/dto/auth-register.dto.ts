import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const authRegisterSchema = zod
  .object({
    name: zod.string().min(2).max(60),
    email: zod.email(),
    password: zod.string().min(6).max(60),
    confirmPassword: zod.string().min(6).max(60).optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export class AuthRegisterDto extends createZodDto(authRegisterSchema) {}
