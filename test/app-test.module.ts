import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from "../src/config/typeorm.config"
import { ProducerModule } from "../src/modules/producer/producer.module"
import { FarmModule } from "../src/modules/farm/farm.module"
import { HarvestModule } from "../src/modules/harvest/harvest.module"
import { CropModule } from "../src/modules/crop/crop.module"
import { AuthModule } from "../src/modules/auth/auth.module"
import { AppController } from "../src/app.controller"
import { AppService } from "../src/app.service"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV || "test"}`,
    }),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: true,
      dropSchema: true,
      logging: false,
    }),
    ProducerModule,
    FarmModule,
    HarvestModule,
    CropModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppTestModule {}
