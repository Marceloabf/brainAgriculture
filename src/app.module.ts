import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { typeOrmConfig } from "./config/typeorm.config"
import { ProducerModule } from "./modules/producer/producer.module"
import { FarmModule } from "./modules/farm/farm.module"
import { HarvestModule } from "./modules/harvest/harvest.module"
import { CropModule } from "./modules/crop/crop.module"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./modules/auth/auth.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `env/.env.${process.env.NODE_ENV || "dev"}`
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    ProducerModule,
    FarmModule,
    HarvestModule,
    CropModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
