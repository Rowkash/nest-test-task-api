import { verify } from 'argon2'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { and, count, eq, like, SQL } from 'drizzle-orm'

import {
  IUserDataRemoving,
  IGetUserFilterOptions,
  IGetOneUserOptions,
  IUserDataUpdate,
  IGetUsersPageOptions,
} from '@/users/interfaces/user.service.interfaces'
import { DATABASE_CONNECTION } from '@/database/database.module'
import * as schema from '@/users/schemas/user.schema'
import { SortingDbHelper } from '@/common/helper/sorting.helper'
import { TUserInsertSchema } from '@/users/schemas/user.schema'
import { SessionsService } from '@/sessions/services/sessions.service'

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly sessionsService: SessionsService,
  ) {}

  async create(data: TUserInsertSchema) {
    const [user] = await this.database
      .insert(schema.users)
      .values(data)
      .returning()
    return user
  }

  async update(data: IUserDataUpdate) {
    const { id, ...updateData } = data
    const filter = this.getFilter({ id })
    await this.database.update(schema.users).set(updateData).where(filter)
  }

  async remove({ id, password }: IUserDataRemoving) {
    const user = await this.getOne({ id })
    const verifyPass = await verify(user.password, password)
    if (!verifyPass) {
      throw new BadRequestException('Wrong password')
    }
    await this.database.delete(schema.users).where(eq(schema.users.id, id))
    await this.sessionsService.removeAllSessionsByUser(user.id)
  }

  async getOne(options: IGetOneUserOptions) {
    const filter = this.getFilter(options)
    const [user] = await this.database.select().from(schema.users).where(filter)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getPage(options: IGetUsersPageOptions) {
    const { limit, page, sortBy, orderSort } = options
    const sorting = new SortingDbHelper(schema.users, sortBy, orderSort)
    const filter = this.getFilter(options)
    const usersQuery = this.database
      .select()
      .from(schema.users)
      .orderBy(sorting.orderBy)
      .where(filter)
      .limit(limit)
      .offset((page - 1) * limit)

    const totalCountQuery = this.database
      .select({ total: count() })
      .from(schema.users)
      .where(filter)

    const [users, [{ total }]] = await Promise.all([
      usersQuery,
      totalCountQuery,
    ])
    return { models: users, count: total }
  }

  async checkUserEmailExists(email: string) {
    const [user] = await this.database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
    if (user) {
      throw new BadRequestException('User email already exist')
    }
  }

  getFilter(options: IGetUserFilterOptions): SQL | undefined {
    const filter: (SQL | undefined)[] = []

    if (options.id) {
      filter.push(eq(schema.users.id, options.id))
    }
    if (options.email) {
      filter.push(eq(schema.users.email, options.email))
    }
    if (options.name) {
      filter.push(like(schema.users.name, `%${options.name}%`))
    }
    if (options.status) {
      filter.push(eq(schema.users.status, options.status))
    }

    return filter.length === 1 ? filter[0] : and(...filter)
  }
}
