import { Test, TestingModule } from '@nestjs/testing'

import { UsersService } from '@/users/services/users.service'
import { IGetUserFilterOptions } from '@/users/interfaces/user.service.interfaces'
import { DATABASE_CONNECTION } from '@/database/database.module'
import { SessionsService } from '@/sessions/services/sessions.service'
import { eq, like } from 'drizzle-orm'
import * as schema from '@/users/schemas/user.schema'
import { UserStatusEnum } from '@/users/enums/user-status.enum'

describe('UsersService', () => {
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DATABASE_CONNECTION,
          useValue: {},
        },
        {
          provide: SessionsService,
          useValue: {},
        },
      ],
    }).compile()

    usersService = module.get(UsersService)
  })

  it('should be defined', () => {
    expect(UsersService).toBeDefined()
  })

  describe('getFilter()', () => {
    it.each`
      payload                               | expectedResult
      ${{}}                                 | ${undefined}
      ${{ id: 123 }}                        | ${eq(schema.users.id, 123)}
      ${{ email: 'user@example.com' }}      | ${eq(schema.users.email, 'user@example.com')}
      ${{ name: 'Billy' }}                  | ${like(schema.users.name, `%Billy%`)}
      ${{ status: UserStatusEnum.BLOCKED }} | ${eq(schema.users.status, UserStatusEnum.BLOCKED)}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = usersService.getFilter(payload as IGetUserFilterOptions)
        expect(result).toEqual(expectedResult)
      },
    )
  })
})
