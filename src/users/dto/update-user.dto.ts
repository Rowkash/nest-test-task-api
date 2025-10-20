import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'
import { UserStatusEnum } from '@/users/enums/user-status.enum'

export const updateUserSchema = zod
  .object({
    name: zod.string().min(2).max(60).optional(),
    oldPassword: zod.string().min(6).max(60).optional(),
    newPassword: zod.string().min(6).max(60).optional(),
    confirmNewPassword: zod.string().min(6).max(60).optional(),
  })
  .superRefine((data, ctx) => {
    const hasAnyPasswordField =
      data.oldPassword || data.newPassword || data.confirmNewPassword
    if (hasAnyPasswordField) {
      if (!data.oldPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'oldPassword is required when changing password',
          path: ['oldPassword'],
        })
      }
      if (!data.newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'newPassword is required when changing password',
          path: ['newPassword'],
        })
      }
      if (!data.confirmNewPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'confirmNewPassword is required when changing password',
          path: ['confirmNewPassword'],
        })
      }
      if (
        data.newPassword &&
        data.confirmNewPassword &&
        data.newPassword !== data.confirmNewPassword
      ) {
        ctx.addIssue({
          code: 'custom',
          message: 'newPassword and confirmNewPassword must match',
          path: ['confirmNewPassword'],
        })
      }
    }
  })

export const adminUpdateUserSchema = zod.object({
  status: zod.enum(UserStatusEnum).optional(),
})

export class AdminUpdateUserDto extends createZodDto(adminUpdateUserSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
