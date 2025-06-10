import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProducerModule } from './modules/producer/producer.module';
import { FarmModule } from './modules/farm/farm.module';
import { HarvestModule } from './modules/harvest/harvest.module';
import { CropModule } from './modules/crop/crop.module';
@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ProducerModule, FarmModule, HarvestModule, CropModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
