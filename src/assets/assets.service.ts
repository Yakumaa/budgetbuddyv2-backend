import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto } from './dto';
import { Asset } from '@prisma/client';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async createAsset(userId: number, data: CreateAssetDto): Promise<Asset> {
    console.log('createAsset data:', data); // Log incoming data
    const asset = await this.prisma.asset.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        name: data.name,
        value: data.value,
        purchase_date: data.purchase_date,
        description: data.description,
      },
    });
    console.log('Created asset:', asset); // Log created asset
    return asset;
  }

  async getAssets(userId: number): Promise<Asset[]> {
    const assets = await this.prisma.asset.findMany({
      where: { user_id: userId },
    });
    console.log('Retrieved assets:', assets); // Log retrieved assets
    return assets;
  }

  async getAssetById(assetId: number, user_id: number): Promise<Asset | null> {
    const asset = await this.prisma.asset.findUnique({
      where: { asset_id: assetId, user_id },
    });
    console.log('Retrieved asset:', asset); // Log retrieved asset
    return asset;
  }

  async updateAsset(assetId: number, data: UpdateAssetDto): Promise<Asset> {
    console.log('updateAsset data:', data); // Log incoming data
    const asset = await this.prisma.asset.update({
      where: { asset_id: assetId },
      data,
    });
    console.log('Updated asset:', asset); // Log updated asset
    return asset;
  }

  async deleteAsset(assetId: number): Promise<Asset> {
    const asset = await this.prisma.asset.delete({
      where: { asset_id: assetId },
    });
    console.log('Deleted asset:', asset); // Log deleted asset
    return asset;
  }

  async getTotalAsset(userId: number): Promise<number> {
    const totalAsset = await this.prisma.asset.aggregate({
      where: { user_id: userId },
      _sum: { value: true },
    });
    console.log('Total asset:', totalAsset); // Log total asset
    return totalAsset._sum.value || 0;
  }
}
