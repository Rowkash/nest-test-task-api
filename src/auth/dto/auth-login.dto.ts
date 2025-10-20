import { authRegisterSchema } from '@/auth/dto/auth-register.dto'
import { createZodDto } from 'nestjs-zod'

export const authLoginSchema = authRegisterSchema.pick({
  email: true,
  password: true,
})

export class AuthLoginDto extends createZodDto(authLoginSchema) {}
