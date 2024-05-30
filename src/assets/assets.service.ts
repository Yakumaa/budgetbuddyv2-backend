import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async createAsset(data: any) {
    return this.prisma.asset.create({ data });
  }

  async getAssets(userId: number) {
    return this.prisma.asset.findMany({
      where: { user_id: userId },
    });
  }

  async getAssetById(id: number) {
    return this.prisma.asset.findUnique({ where: { asset_id: id } });
  }

  async updateAsset(id: number, data: any) {
    return this.prisma.asset.update({ where: { asset_id: id }, data });
  }

  async deleteAsset(id: number) {
    return this.prisma.asset.delete({ where: { asset_id: id } });
  }
}
