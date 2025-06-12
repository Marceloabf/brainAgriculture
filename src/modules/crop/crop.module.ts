import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crop } from './entities/crop.entity';
import { CropService } from './crop.service';
import { CropController } from './crop.controller';
import { HarvestModule } from '../harvest/harvest.module';

@Module({
  imports: [TypeOrmModule.forFeature([Crop]), HarvestModule],
  controllers: [CropController],
  providers: [CropService],
})
export class CropModule {}
