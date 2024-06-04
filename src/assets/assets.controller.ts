import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { GetCurrentUserId } from 'src/auth/decorator';
import { CreateAssetDto, UpdateAssetDto } from './dto';
import { AtGuard } from '../auth/guard/at.guard';

@Controller('assets')
@UseGuards(AtGuard)
export class AssetsController {
  constructor(private assetsService: AssetsService) {}

  @Post()
  async createAsset(@GetCurrentUserId() userId: number, @Body() createAssetDto: CreateAssetDto) {
    console.log('createAssetDto:', createAssetDto); // Log incoming DTO
    return this.assetsService.createAsset(userId, createAssetDto);
  }

  @Get()
  async getAssets(@GetCurrentUserId() userId: number) {
    return this.assetsService.getAssets(userId);
  }

  @Get(':id')
  async getAssetById(@Param('id') id: string) {
    return this.assetsService.getAssetById(+id);
  }

  @Put(':id')
  async updateAsset(@Param('id') id: string, @Body() updateAssetDto: UpdateAssetDto) {
    console.log('updateAssetDto:', updateAssetDto); // Log incoming DTO
    return this.assetsService.updateAsset(+id, updateAssetDto);
  }

  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.assetsService.deleteAsset(+id);
  }
}
