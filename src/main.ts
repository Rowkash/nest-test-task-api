import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@/app.module'
import { ZodValidationExceptionFilter } from '@/common/filters/zod.exception.filter'

function setupSwagger(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('Api')
    .setDescription('API docs')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options, {})

  SwaggerModule.setup('/doc', app, cleanupOpenApiDoc(document), {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get<ConfigService>(ConfigService)
  const PORT = configService.get<number>('app.port')

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new ZodValidationExceptionFilter())

  setupSwagger(app)
  await app.listen(PORT)
}

void bootstrap()
