import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { FarmModule } from '../farm/farm.module';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest]), FarmModule],
  controllers: [HarvestController],
  providers: [HarvestService],
  exports: [TypeOrmModule],
})
export class HarvestModule {}
