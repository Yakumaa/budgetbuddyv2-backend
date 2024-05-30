import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { AssetsService } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post()
  async createAsset(@Body() data: any) {
    return this.assetsService.createAsset(data);
  }

  @Get()
  async getAssets(@Param('userId') userId: number) {
    return this.assetsService.getAssets(userId);
  }

  @Get(':id')
  async getAssetById(@Param('id') id: number) {
    return this.assetsService.getAssetById(id);
  }

  @Put(':id')
  async updateAsset(@Param('id') id: number, @Body() data: any) {
    return this.assetsService.updateAsset(id, data);
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: number) {
    return this.assetsService.deleteAsset(id);
  }
}
