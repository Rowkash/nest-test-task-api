import { UserStatusEnum } from '@/users/enums/user-status.enum'
import { UsersPageSortByEnum } from '@/users/dto/users-page.dto'
import { PageDto } from '@/common/schemas/page.schema'

export interface IUserDataUpdate {
  id: number
  name?: string
}

export interface IUserDataRemoving {
  id: number
  password: string
}

export interface IGetUserFilterOptions {
  id?: number
  name?: string
  email?: string
  status?: UserStatusEnum
}

export interface IGetOneUserOptions {
  id?: number
  email?: string
  status?: UserStatusEnum
}

export interface IGetUsersPageOptions extends PageDto {
  name?: string
  email?: string
  status?: UserStatusEnum
  sortBy: UsersPageSortByEnum
}
