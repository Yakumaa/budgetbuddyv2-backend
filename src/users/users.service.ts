import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users, Prisma } from '@prisma/client';
import { UpdateUserDto, ChangePasswordDto, DeleteUserDto, UpdateUserRoleDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   async findAll(): Promise<Users[]> {
//     return this.prisma.users.findMany();
//   }

//   async findOne(id: number): Promise<Users | null> {
//     return this.prisma.users.findUnique({
//       where: { id },
//     });
//   }

//   async findByUsername(username: string): Promise<Users | null> {
//     return this.prisma.users.findUnique({
//       where: { username },
//     });
//   }

//   async create(data: Prisma.UsersCreateInput): Promise<Users> {
//     return this.prisma.users.create({
//       data,
//     });
//   }

//   async update(id: number, data: Prisma.UsersUpdateInput): Promise<Users> {
//     return this.prisma.users.update({
//       where: { id },
//       data,
//     });
//   }

//   async changePassword(id: number, currentPassword: string, newPassword: string): Promise<Users> {
//     const user = await this.prisma.users.findUnique({
//       where: { id },
//     });
//     if (!user) {
//       throw new Error('User not found');
//     }
    
//     const isPasswordValid = await bcrypt.compare(currentPassword, user.hash);
//     if (!isPasswordValid) {
//       throw new Error('Invalid password');
//     }
    
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     return this.prisma.users.update({
//       where: { id },
//       data: { hash: hashedPassword },
//     });
//   }

//   async delete(id: number): Promise<Users> {
//     return this.prisma.users.delete({
//       where: { id },
//     });
//   }
// }

export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  //TODO: remove password from updateUser
  async updateUser(userId: number, data: UpdateUserDto) {
    console.log('updateUser data:', data); // Log incoming data
    const { password, ...rest } = data;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: { ...rest, hash },
      });
      console.log('updatedUser with password:', updatedUser); // Log updated user
      return updatedUser;
    }

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: rest,
    });
    console.log('updatedUser without password:', updatedUser); // Log updated user
    return updatedUser;
  }

  async changePassword(userId: number, data: ChangePasswordDto) {
    console.log('changePassword data:', data); // Log incoming data

    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    console.log('current user data:', user); // Log current user data

    if (user && (await bcrypt.compare(data.currentPassword, user.hash))) {
      console.log('Current password matches'); // Log password match

      const hash = await bcrypt.hash(data.newPassword, 10);
      const updatedUser = await this.prisma.users.update({
        where: { id: userId },
        data: { hash },
      });

      console.log('Password updated successfully:', updatedUser); // Log updated user
      return updatedUser;
    }

    console.error('Incorrect password'); // Log incorrect password
    throw new Error('Incorrect password');
  }

  async deleteUser(userId: number, data: DeleteUserDto) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (user && (await bcrypt.compare(data.password, user.hash))) {
      return this.prisma.users.delete({ where: { id: userId } });
    }
    throw new Error('Incorrect password');
  }

  async updateUserRole(userId: number, data: UpdateUserRoleDto) {
    console.log('updateUserRole data:', data); // Log incoming data

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: { role: data.role },
    });

    console.log('User role updated successfully:', updatedUser); // Log updated user
    return updatedUser;
  }
}