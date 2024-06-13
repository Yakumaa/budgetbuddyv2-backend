import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users, Prisma } from '@prisma/client';
import { UpdateUserDto, ChangePasswordDto, DeleteUserDto, UpdateUserRoleDto } from './dto';
import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async findUserById(userId: number): Promise<Users> {
    return this.prisma.users.findUnique({ where: { id: userId } });
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    console.log('updateUser data:', data); 

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data,
    });
    console.log('updatedUser without password:', updatedUser); 
    return updatedUser;
  }

  async changePassword(userId: number, data: ChangePasswordDto): Promise<any> {
    try {
      console.log('changePassword data:', data); 

      const user = await this.prisma.users.findUnique({ where: { id: userId } });
      console.log('current user data:', user); 

      if (!user) {
        console.error('User not found'); 
        throw new BadRequestException('User not found');
      }

      const passwordMatch = await argon2.verify(user.hash, data.currentPassword);
      if (!passwordMatch) {
        console.error('Current password is incorrect'); 
        throw new BadRequestException('Current password is incorrect');
      }

      console.log('Current password matches'); 

      const hash = await argon2.hash(data.newPassword);
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: { hash },
      });

      console.log('Password updated successfully:', updatedUser);
      return updatedUser;

    } catch (error) {
      console.error('Error changing password:', error);
      throw new BadRequestException('Error changing password');
    }
  }
  
  async deleteUser(userId: number, data: DeleteUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (user && (await bcrypt.compare(data.password, user.hash))) {
      return this.prisma.users.delete({ where: { id: userId } });
    }
    throw new Error('Incorrect password');
  }

  async updateUserRole(userId: number, data: UpdateUserRoleDto) {
    console.log('updateUserRole data:', data); 

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: { role: data.role },
    });

    console.log('User role updated successfully:', updatedUser);
    return updatedUser;
  }
}