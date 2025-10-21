import { ZodResponse } from 'nestjs-zod'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common'

import { NotesService } from '@/notes/services/notes.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import { NoteResponseDto } from '@/notes/dto/response-note.dto'
import { NotesPageDto, NotesPageResponseDto } from '@/notes/dto/notes-page.dto'

@ApiBearerAuth()
@ApiTags('Admin Notes')
@UseGuards(AuthGuard, RolesAccessGuard)
@RolesAccess([UserRoleEnum.ADMIN])
@Controller('admin/notes')
export class AdminNotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({ summary: 'Return note by id' })
  @ZodResponse({ type: NoteResponseDto })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) noteId: number) {
    return this.notesService.getOne({ id: noteId })
  }

  @ApiOperation({ summary: 'Get notes page' })
  @ZodResponse({ type: NotesPageResponseDto })
  @Get()
  async getPage(@Query() query: NotesPageDto) {
    const { models, count } = await this.notesService.getPage({
      ...query,
    })

    return { models, count }
  }
}
