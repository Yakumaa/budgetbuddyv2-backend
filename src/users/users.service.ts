import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Users, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany();
  }

  async findOne(id: number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async create(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  async update(id: number, data: Prisma.UsersUpdateInput): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Users> {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}
