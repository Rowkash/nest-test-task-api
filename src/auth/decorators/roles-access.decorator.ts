import { Reflector } from '@nestjs/core'
import { UserRoleEnum } from '@/users/enums/user-role.enum'

export const ROLES_KEY = 'roles-access'

export const RolesAccess = Reflector.createDecorator<UserRoleEnum[]>({
  key: ROLES_KEY,
})
