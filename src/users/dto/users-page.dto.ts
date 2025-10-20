import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

import { pageSchema } from '@/common/schemas/page.schema'
import { AdminUserResponseDto } from '@/users/dto/response-user.dto'
import { UserStatusEnum } from '@/users/enums/user-status.enum'

export enum UsersPageSortByEnum {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  STATUS = 'status',
}

const adminUsersPageSchema = pageSchema.extend({
  name: zod.string().optional(),
  status: zod.enum(UserStatusEnum).optional(),
  sortBy: zod
    .enum(UsersPageSortByEnum)
    .optional()
    .default(UsersPageSortByEnum.CREATED_AT),
})

const adminUsersPageResponseSchema = zod.object({
  models: zod.array(AdminUserResponseDto.schema),
  count: zod.number(),
})

export class AdminUsersPageDto extends createZodDto(adminUsersPageSchema) {}
export class AdminUsersPageResponseDto extends createZodDto(
  adminUsersPageResponseSchema,
) {}
