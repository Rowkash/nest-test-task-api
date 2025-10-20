import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const createNoteSchema = zod.object({
  title: zod.string().min(2).max(255),
  content: zod.string().optional(),
})

export class CreateNoteDto extends createZodDto(createNoteSchema) {}
