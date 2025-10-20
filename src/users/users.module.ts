import { Module } from '@nestjs/common'

import { UsersController } from '@/users/controllers/users.controller'
import { UsersService } from '@/users/services/users.service'
import { DatabaseModule } from '@/database/database.module'
import { AdminUsersController } from '@/users/controllers/admin-users.controller'
import { SessionsModule } from '@/sessions/sessions.module'

@Module({
  imports: [DatabaseModule, SessionsModule],
  controllers: [AdminUsersController, UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
