import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

import { pageSchema } from '@/common/schemas/page.schema'
import { NoteResponseDto } from '@/notes/dto/response-note.dto'

export enum NotesPageSortByEnum {
  CREATED_AT = 'createdAt',
  NAME = 'name',
}

const notesPageSchema = pageSchema.extend({
  title: zod.string().optional(),
  sortBy: zod
    .enum(NotesPageSortByEnum)
    .optional()
    .default(NotesPageSortByEnum.CREATED_AT),
})

const notesPageResponseSchema = zod.object({
  models: zod.array(NoteResponseDto.schema),
  count: zod.number(),
})

export class NotesPageDto extends createZodDto(notesPageSchema) {}
export class NotesPageResponseDto extends createZodDto(
  notesPageResponseSchema,
) {}
