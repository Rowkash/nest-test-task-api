import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { and, count, eq, like, SQL } from 'drizzle-orm'

import {
  IGetNoteFilterOptions,
  IGetNotesPageOptions,
  IGetOneNoteOptions,
  INoteDataRemoving,
  INoteDataUpdate,
} from '@/notes/interfaces/notes.service.interfaces'
import { SortingDbHelper } from '@/common/helper/sorting.helper'
import { TNoteInsertSchema } from '@/notes/schemas/note.schema'
import * as schema from '@/notes/schemas/note.schema'
import { DATABASE_CONNECTION } from '@/database/database.module'

export class NotesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: TNoteInsertSchema) {
    const [note] = await this.database
      .insert(schema.notes)
      .values(data)
      .returning()
    return { ...note, createdAt: note.createdAt.toISOString() }
  }

  async update(data: INoteDataUpdate) {
    const { id, userId, ...updateData } = data
    const filter = this.getFilter({ id })
    const note = await this.getOne({ id })
    if (note.authorId !== userId) {
      throw new ForbiddenException('Permission denied')
    }
    await this.database.update(schema.notes).set(updateData).where(filter)
  }

  async getOne(options: IGetOneNoteOptions) {
    const filter = this.getFilter(options)
    const [note] = await this.database.select().from(schema.notes).where(filter)
    if (!note) {
      throw new NotFoundException('Note not found')
    }
    return { ...note, createdAt: note.createdAt.toISOString() }
  }

  async getPage(options: IGetNotesPageOptions) {
    const { limit, page, sortBy, orderSort } = options
    const sorting = new SortingDbHelper(schema.notes, sortBy, orderSort)
    const filter = this.getFilter(options)
    const notesQuery = this.database
      .select()
      .from(schema.notes)
      .orderBy(sorting.orderBy)
      .where(filter)
      .limit(limit)
      .offset((page - 1) * limit)

    const totalCountQuery = this.database
      .select({ total: count() })
      .from(schema.notes)
      .where(filter)

    const [notes, [{ total }]] = await Promise.all([
      notesQuery,
      totalCountQuery,
    ])

    const mappedNotes = notes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString(),
    }))

    return { models: mappedNotes, count: total }
  }

  async remove({ id, userId }: INoteDataRemoving) {
    const filter = this.getFilter({ id })
    const note = await this.getOne({ id })
    if (note.authorId !== userId) {
      throw new ForbiddenException('Permission denied')
    }
    await this.database.delete(schema.notes).where(filter)
  }

  getFilter(options: IGetNoteFilterOptions) {
    const filter: (SQL | undefined)[] = []

    if (options.id) {
      filter.push(eq(schema.notes.id, options.id))
    }
    if (options.authorId) {
      filter.push(eq(schema.notes.authorId, options.authorId))
    }
    if (options.title) {
      filter.push(like(schema.notes.title, `%${options.title}%`))
    }

    return filter.length === 1 ? filter[0]! : and(...filter)
  }
}
