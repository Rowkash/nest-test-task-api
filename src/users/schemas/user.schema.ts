import { relations, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  integer,
  varchar,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { notes } from '@/notes/schemas/note.schema'
import { timestamps } from '@/common/helper/columns.helper'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { UserStatusEnum } from '@/users/enums/user-status.enum'

export const userStatusPgEnum = pgEnum('status', UserStatusEnum)
export const userRolePgEnum = pgEnum('roles', UserRoleEnum)

export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name').notNull(),
    email: varchar('email').unique().notNull(),
    password: varchar('password').notNull(),
    status: userStatusPgEnum().default(UserStatusEnum.ACTIVE),
    role: userRolePgEnum().default(UserRoleEnum.USER),
    ...timestamps,
  },
  table => [uniqueIndex('email_idx').on(table.email)],
)

export const userRelations = relations(users, ({ many }) => ({
  notes: many(notes),
}))

export type TUserSchema = InferSelectModel<typeof users>
export type TUserInsertSchema = InferInsertModel<typeof users>
