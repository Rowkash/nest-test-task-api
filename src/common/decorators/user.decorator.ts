import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { IRequestUser } from '@/common/interfaces/custom-request.interface'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as IRequestUser
  },
)
