import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const noteResponseSchema = zod.object({
  id: zod.number(),
  title: zod.string(),
  content: zod.string().optional(),
  createdAt: zod.iso.datetime(),
})

export class NoteResponseDto extends createZodDto(noteResponseSchema) {}
