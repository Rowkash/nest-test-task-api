import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const deleteUserSchema = zod.object({
  password: zod.string().min(6).max(60).nonoptional(),
})

export class DeleteUserDto extends createZodDto(deleteUserSchema) {}
