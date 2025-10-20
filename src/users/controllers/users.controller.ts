import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'

import { UsersService } from '@/users/services/users.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface'
import { UserResponseDto } from '@/users/dto/response-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { DeleteUserDto } from '@/users/dto/delete-user.dto'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import { UserRoleEnum } from '@/users/enums/user-role.enum'

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesAccessGuard)
@RolesAccess([UserRoleEnum.ADMIN, UserRoleEnum.USER])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return self user' })
  @ZodResponse({ type: UserResponseDto })
  @Get('me')
  async getSelfUser(@Req() { user }: ICustomRequest) {
    const { id } = user as IRequestUser

    return await this.usersService.getOne({ id })
  }

  @ApiOperation({ summary: 'Update self user' })
  @Patch('me')
  async update(@Req() { user }: ICustomRequest, @Body() dto: UpdateUserDto) {
    const { id } = user as IRequestUser
    await this.usersService.update({ id, ...dto })
  }

  @ApiOperation({ summary: 'Delete self user' })
  @Delete('me')
  async remove(
    @Req() { user }: ICustomRequest,
    @Body() { password }: DeleteUserDto,
  ) {
    const { id } = user as IRequestUser
    await this.usersService.remove({ id, password })
  }
}
