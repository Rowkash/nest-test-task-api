import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { ROLES_KEY } from '@/auth/decorators/roles-access.decorator'
import { IRequestUser } from '@/common/interfaces/custom-request.interface'

@Injectable()
export class RolesAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles =
      this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getHandler()) ||
      this.reflector.get<UserRoleEnum[]>(ROLES_KEY, context.getClass())

    if (!roles) {
      return false
    }
    const request = context.switchToHttp().getRequest()
    const user = request.user as IRequestUser

    return user.role && roles.includes(user.role)
  }
}
