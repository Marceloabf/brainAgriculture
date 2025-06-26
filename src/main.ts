import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {logger: ["error", "warn", "log", "debug", "verbose"]});

  const logger = new Logger("Bootstrap")

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('Documentação da API de gerenciamento de produtores, fazendas, safras e culturas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.log("Aplicação iniciada na porta 3000")
}
bootstrap();
