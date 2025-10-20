import { PageDto } from '@/common/schemas/page.schema'
import { NotesPageSortByEnum } from '@/notes/dto/notes-page.dto'

export interface INoteDataUpdate {
  id: number
  userId: number
  title?: string
  content?: string
}

export interface INoteDataRemoving {
  id: number
  userId?: number
}

export interface IGetNoteFilterOptions {
  id?: number
  authorId?: number
  title?: string
}

export interface IGetOneNoteOptions {
  id?: number
  authorId?: number
  title?: string
}

export interface IGetNotesPageOptions extends PageDto {
  title?: string
  authorId?: number
  sortBy: NotesPageSortByEnum
}
