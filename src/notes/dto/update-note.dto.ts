import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export const updateNoteSchema = zod.object({
  title: zod.string().min(2).max(255).optional(),
  content: zod.string().optional(),
})

export class UpdateNoteDto extends createZodDto(updateNoteSchema) {}
