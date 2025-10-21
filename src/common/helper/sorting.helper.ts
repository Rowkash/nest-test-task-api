import { AnyColumn, asc, desc, Table } from 'drizzle-orm'

export class SortingDbHelper<T extends Table> {
  readonly table: T
  readonly sortBy: string
  readonly orderSort: string

  constructor(table: T, sortBy: string, orderSort: string) {
    this.table = table
    this.sortBy = sortBy
    this.orderSort = orderSort
  }

  get orderBy() {
    const column = this.table[this.sortBy as keyof T] as AnyColumn | undefined
    const sortField =
      column ?? (this.table['created_at' as keyof T] as AnyColumn)
    return this.orderSort === 'asc' ? asc(sortField) : desc(sortField)
  }
}
