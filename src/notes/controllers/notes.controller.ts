import { ZodResponse } from 'nestjs-zod'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import { NotesService } from '@/notes/services/notes.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import { IRequestUser } from '@/common/interfaces/custom-request.interface'
import { CreateNoteDto } from '@/notes/dto/create-note.dto'
import { NoteResponseDto } from '@/notes/dto/response-note.dto'
import { NotesPageDto, NotesPageResponseDto } from '@/notes/dto/notes-page.dto'
import { UpdateNoteDto } from '@/notes/dto/update-note.dto'
import { User } from '@/common/decorators/user.decorator'

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesAccessGuard)
@RolesAccess([UserRoleEnum.ADMIN, UserRoleEnum.USER])
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @ApiOperation({
    summary: 'Create note',
    description: 'Create user note',
  })
  @ZodResponse({ type: NoteResponseDto })
  @Post()
  async create(@User() user: IRequestUser, @Body() dto: CreateNoteDto) {
    return this.notesService.create({ ...dto, authorId: user.id })
  }

  @ApiOperation({ summary: 'Update user note by id' })
  @Patch(':id')
  async update(
    @User() user: IRequestUser,
    @Param('id', ParseIntPipe) noteId: number,
    @Body() dto: UpdateNoteDto,
  ) {
    await this.notesService.update({ id: noteId, userId: user.id, ...dto })
  }

  @ApiOperation({ summary: 'Return user`s note by id' })
  @ZodResponse({ type: NoteResponseDto })
  @Get(':id')
  async findOne(
    @User() user: IRequestUser,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    return this.notesService.getOne({ id: noteId, authorId: user.id })
  }

  @ApiOperation({ summary: 'Get user`s notes page' })
  @ZodResponse({ type: NotesPageResponseDto })
  @Get()
  async getPage(@User() user: IRequestUser, @Query() query: NotesPageDto) {
    const { models, count } = await this.notesService.getPage({
      ...query,
      authorId: user.id,
    })

    return { models, count }
  }

  @ApiOperation({ summary: 'Delete note' })
  @Delete(':id')
  async remove(
    @User() user: IRequestUser,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    await this.notesService.remove({ id: noteId, userId: user.id })
  }
}
