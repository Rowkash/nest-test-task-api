import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CacheModule } from '@nestjs/cache-manager'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ZodValidationPipe, ZodSerializerInterceptor } from 'nestjs-zod'

import appConfig from '@/configs/app.config'
import { DatabaseModule } from '@/database/database.module'
import { CacheConfigService } from '@/configs/cache-config.service'
import { AuthModule } from '@/auth/auth.module'
import { SessionsModule } from '@/sessions/sessions.module'
import { UsersModule } from '@/users/users.module'
import authConfig from '@/configs/auth.config'
import { AuthMiddleware } from '@/common/middlewares/auth.middleware'
import { NotesModule } from '@/notes/notes.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    SessionsModule,
    NotesModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('')
  }
}
