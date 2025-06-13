import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { FarmModule } from '../farm/farm.module';
import { CropModule } from '../crop/crop.module';
import { Crop } from '../crop/entities/crop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest, Crop]), FarmModule,  forwardRef(() => CropModule)],
  controllers: [HarvestController],
  providers: [HarvestService],
  exports: [TypeOrmModule],
})
export class HarvestModule {}
