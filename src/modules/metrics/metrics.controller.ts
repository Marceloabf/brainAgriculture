import { Controller, Get, Header } from '@nestjs/common';
import * as client from 'prom-client';
import { Public } from 'src/common/decorators/public.decorator';

client.collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Public()
  @Get()
  @Header('Content-Type', client.register.contentType)
  async getMetrics(): Promise<string> {
    return await client.register.metrics();
  }
}

