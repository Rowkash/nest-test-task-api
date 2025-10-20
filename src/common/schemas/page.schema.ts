import { z as zod } from 'zod'
import { createZodDto } from 'nestjs-zod'

export enum OrderSortEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export const pageSchema = zod.object({
  page: zod.coerce
    .number('Page field should be number')
    .min(1)
    .optional()
    .default(1),
  limit: zod.coerce
    .number('Limit field should be number')
    .min(1)
    .max(500)
    .optional()
    .default(10),
  orderSort: zod.enum(OrderSortEnum).optional().default(OrderSortEnum.ASC),
})

export class PageDto extends createZodDto(pageSchema) {}
