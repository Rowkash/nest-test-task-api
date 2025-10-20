import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { UserStatusEnum } from '@/users/enums/user-status.enum'

export const userResponseSchema = zod.object({
  id: zod.number(),
  name: zod.string(),
  email: zod.string(),
})

export const adminUserResponseSchema = userResponseSchema.extend({
  status: zod.enum(UserStatusEnum),
  role: zod.enum(UserRoleEnum),
})

export class UserResponseDto extends createZodDto(userResponseSchema) {}
export class AdminUserResponseDto extends createZodDto(
  adminUserResponseSchema,
) {}
