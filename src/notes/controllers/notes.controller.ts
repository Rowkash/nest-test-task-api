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
  Req,
  UseGuards,
} from '@nestjs/common'

import { NotesService } from '@/notes/services/notes.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface'
import { CreateNoteDto } from '@/notes/dto/create-note.dto'
import { NoteResponseDto } from '@/notes/dto/response-note.dto'
import { NotesPageDto, NotesPageResponseDto } from '@/notes/dto/notes-page.dto'
import { UpdateNoteDto } from '@/notes/dto/update-note.dto'

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
  async create(@Req() { user }: ICustomRequest, @Body() dto: CreateNoteDto) {
    const { id } = user as IRequestUser
    return await this.notesService.create({ ...dto, authorId: id })
  }

  @ApiOperation({ summary: 'Update user note by id' })
  @Patch(':id')
  async update(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) noteId: number,
    @Body() dto: UpdateNoteDto,
  ) {
    const { id } = user as IRequestUser
    await this.notesService.update({ id: noteId, userId: id, ...dto })
  }

  @ApiOperation({ summary: 'Return user`s note by id' })
  @ZodResponse({ type: NoteResponseDto })
  @Get(':id')
  async findOne(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    const { id } = user as IRequestUser
    return await this.notesService.getOne({ id: noteId, authorId: id })
  }

  @ApiOperation({ summary: 'Get user`s notes page' })
  @ZodResponse({ type: NotesPageResponseDto })
  @Get()
  async getPage(@Req() { user }: ICustomRequest, @Query() query: NotesPageDto) {
    const { id } = user as IRequestUser
    const { models, count } = await this.notesService.getPage({
      ...query,
      authorId: id,
    })

    return { models, count }
  }

  @ApiOperation({ summary: 'Delete note' })
  @Delete(':id')
  async remove(
    @Req() { user }: ICustomRequest,
    @Param('id', ParseIntPipe) noteId: number,
  ) {
    const { id } = user as IRequestUser
    await this.notesService.remove({ id: noteId, userId: id })
  }
}
