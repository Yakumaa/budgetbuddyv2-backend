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

  // @UseGuards(AtGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<Users | null> {
  //   return this.usersService.findOne(+id);
  // }

  // @UseGuards(RtGuard)
  // @Post()
  // create(@Body() data: Prisma.UsersCreateInput): Promise<Users> {
  //   return this.usersService.create(data);
  // }

  // @UseGuards(AtGuard)
  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() data: Prisma.UsersUpdateInput,
  // ): Promise<Users> {
  //   return this.usersService.update(+id, data);
  // }

  // @UseGuards(AtGuard)
  // @Delete(':id')
  // delete(@Param('id') id: string): Promise<Users> {
  //   return this.usersService.delete(+id);
  // }

  // @UseGuards(AtGuard)
  // @Get('me')
  // getMe(@GetCurrentUser('email') email: string): Promise<Users | null> {
  //   return this.usersService.findByUsername(email);
  // }

  // @UseGuards(AtGuard)
  // @Get(':id')
  // getById(@Param('id') id: string, @GetCurrentUserId() userId: number) {
  //   if (+id !== userId) {
  //     // Handle access denied or permissions
  //   }
  //   return this.usersService.findOne(+id);
  // }

  // @UseGuards(AtGuard)
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