import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/logger.config';
import { PrometheusInterceptor } from './common/interceptors/prometheus.interceptor';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const logger = new Logger("Bootstrap")

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('Documentação da API de gerenciamento de produtores, fazendas, safras e culturas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new PrometheusInterceptor());
  await app.listen(3000);
  logger.log("Aplicação iniciada na porta 3000")
}
bootstrap();
