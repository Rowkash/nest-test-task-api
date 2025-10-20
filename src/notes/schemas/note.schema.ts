import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm'
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core'

import { users } from '@/users/schemas/user.schema'
import { timestamps } from '@/common/helper/columns.helper'

export const notes = pgTable('notes', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  title: varchar('title').unique().notNull(),
  content: text('content'),
  ...timestamps,
  authorId: integer('author_id')
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(),
})

export const postRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.authorId],
    references: [users.id],
  }),
}))

export type TNoteSelectSchema = InferSelectModel<typeof notes>
export type TNoteInsertSchema = InferInsertModel<typeof notes>
