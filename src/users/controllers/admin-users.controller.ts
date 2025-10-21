import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'

import { UsersService } from '@/users/services/users.service'
import { AuthGuard } from '@/auth/guards/auth.guard'
import { AdminUserResponseDto } from '@/users/dto/response-user.dto'
import {
  AdminUsersPageDto,
  AdminUsersPageResponseDto,
} from '@/users/dto/users-page.dto'
import { RolesAccessGuard } from '@/auth/guards/roles-access.guard'
import { RolesAccess } from '@/auth/decorators/roles-access.decorator'
import { UserRoleEnum } from '@/users/enums/user-role.enum'
import { AdminUpdateUserDto } from '@/users/dto/update-user.dto'

@ApiBearerAuth()
@ApiTags('Admin Users')
@UseGuards(AuthGuard, RolesAccessGuard)
@RolesAccess([UserRoleEnum.ADMIN])
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Return user by id' })
  @ZodResponse({ type: AdminUserResponseDto })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getOne({ id })
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateUserDto,
  ) {
    await this.usersService.update({ id, ...dto })
  }

  @ApiOperation({ summary: 'Get users page' })
  @ZodResponse({ type: AdminUsersPageResponseDto })
  @Get()
  async getPage(@Query() query: AdminUsersPageDto) {
    const { models, count } = await this.usersService.getPage(query)

    return { models, count }
  }
}
