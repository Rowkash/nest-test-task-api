import { Module } from '@nestjs/common'
import { NotesService } from '@/notes/services/notes.service'
import { DatabaseModule } from '@/database/database.module'
import { NotesController } from '@/notes/controllers/notes.controller'
import { AdminNotesController } from '@/notes/controllers/admin-notes.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController, AdminNotesController],
  providers: [NotesService],
})
export class NotesModule {}
