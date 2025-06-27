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

  const logger = new Logger('Bootstrap');

  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription(
      'Esta API foi desenvolvida para gerenciamento de dados relacionados a propriedades rurais, produtores, colheitas (harvests), culturas (crops) e fazendas (farms), permitindo uma integração eficiente entre sistemas agrícolas.\n\n' +
        'A documentação abaixo fornece todos os endpoints disponíveis, seus parâmetros, respostas esperadas e requisitos de autenticação quando aplicável.\n\n' +
        '🔒 Autenticação\n' +
        'Alguns endpoints exigem autenticação via JWT. Para utilizá-los:\n' +
        '- Clique em "Authorize" no canto superior direito.\n' +
        '- Insira o token JWT no formato: Bearer <token>.\n\n' +
        '📦 Recursos principais da API:\n' +
        '- Producers: cadastro e gerenciamento de produtores rurais.\n' +
        '- Farms: associadas aos produtores, representam as propriedades rurais.\n' +
        '- Crops: culturas cultivadas nas fazendas.\n' +
        '- Harvests: histórico de colheitas vinculadas às culturas e fazendas.\n' +
        '- Users/Auth: gerenciamento de usuários e autenticação.\n\n' +
        '✅ Health Check:\n' +
        'O endpoint /health pode ser utilizado para verificar a disponibilidade da aplicação. Ele não requer autenticação.\n\n' +
        '📘 Como usar:\n' +
        'Você pode clicar em "Try it out" para testar os endpoints diretamente pela interface. Certifique-se de preencher os parâmetros necessários e estar autenticado quando requerido.\n\n' +
        'Para dúvidas técnicas ou integração, consulte os exemplos de payloads nas seções de cada rota.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new PrometheusInterceptor());
  await app.listen(3000);
  logger.log('Aplicação iniciada na porta 3000');
}
bootstrap();
