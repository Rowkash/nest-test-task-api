import { Request } from 'express'

import { UserRoleEnum } from '@/users/enums/user-role.enum'

export interface ICustomRequest extends Request {
  user: IRequestUser | null
}

export interface IRequestUser {
  id: number
  email: string
  role: UserRoleEnum
}
