import { Pool } from 'pg'
import { Module } from '@nestjs/common'
import { drizzle } from 'drizzle-orm/node-postgres'
import { ConfigService } from '@nestjs/config'

import * as userSchema from '@/users/schemas/user.schema'
import * as notesSchema from '@/notes/schemas/note.schema'

export const DATABASE_CONNECTION = 'database_connection'

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('POSTGRES_URL'),
        })
        return drizzle(pool, {
          schema: {
            ...userSchema,
            ...notesSchema,
          },
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
