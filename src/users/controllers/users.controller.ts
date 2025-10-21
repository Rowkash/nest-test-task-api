import { Body, Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'

import { UsersService } from '@/users/services/users.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { IRequestUser } from '@/common/interfaces/custom-request.interface'
import { UserResponseDto } from '@/users/dto/response-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { DeleteUserDto } from '@/users/dto/delete-user.dto'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { User } from '@/common/decorators/user.decorator'

@ApiBearerAuth()
@UseGuards(AuthGuard, RolesAccessGuard)
@RolesAccess([UserRoleEnum.ADMIN, UserRoleEnum.USER])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return self user' })
  @ZodResponse({ type: UserResponseDto })
  @Get('me')
  async getSelfUser(@User() user: IRequestUser) {
    return this.usersService.getOne({ id: user.id })
  }

  @ApiOperation({ summary: 'Update self user' })
  @Patch('me')
  async update(@User() user: IRequestUser, @Body() dto: UpdateUserDto) {
    await this.usersService.update({ id: user.id, ...dto })
  }

  @ApiOperation({ summary: 'Delete self user' })
  @Delete('me')
  async remove(
    @User() user: IRequestUser,
    @Body() { password }: DeleteUserDto,
  ) {
    await this.usersService.remove({ id: user.id, password })
  }
}
