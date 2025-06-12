import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { FarmService } from './farm.service';
import { FarmController } from './farm.controller';
import { ProducerModule } from '../producer/producer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), ProducerModule],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [TypeOrmModule]
})
export class FarmModule {}
