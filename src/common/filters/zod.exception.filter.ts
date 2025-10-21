import { ZodValidationException } from 'nestjs-zod'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { ZodError, z as zod } from 'zod'
import { Response } from 'express'

@Catch(ZodValidationException)
export class ZodValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const error = exception.getZodError() as ZodError
    const formatErrors = zod.treeifyError(error) as any

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed',
      details: formatErrors?.properties ?? {},
    })
  }
}
