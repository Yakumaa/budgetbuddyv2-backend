import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, ChangePasswordDto, DeleteUserDto, UpdateUserRoleDto } from './dto';
import { Users, Prisma } from '@prisma/client';
import { AtGuard, RtGuard } from '../auth/guard';
import { GetCurrentUser, GetCurrentUserId } from '../auth/decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseGuards(AtGuard)
  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findUserById(@GetCurrentUserId() userId: number): Promise<Users> {
    return this.usersService.findUserById(userId);
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log('updateUserDto:', updateUserDto); // Log incoming DTO
    return this.usersService.updateUser(+id, updateUserDto);
  }

  @Put('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    console.log('changePasswordDto:', changePasswordDto); // Log incoming DTO
    return this.usersService.changePassword(+id, changePasswordDto);
  }

  @Delete('delete/:id')
  async deleteUser(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.deleteUser(+id, deleteUserDto);
  }

  @Put('role/:id')
  async updateUserRole(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    console.log('updateUserRoleDto:', updateUserRoleDto); // Log incoming DTO
    return this.usersService.updateUserRole(+id, updateUserRoleDto);
  }
}
