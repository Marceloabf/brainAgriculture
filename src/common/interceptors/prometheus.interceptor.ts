import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  httpRequestDurationSeconds,
  httpRequestsTotal,
  httpRequestsInProgress,
} from '../../modules/metrics/prometheus.metrics';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const route = req.route?.path || req.url;

    httpRequestsInProgress.inc({ method, route });

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const statusCode = res.statusCode;
        const durationSeconds = (Date.now() - start) / 1000;

        httpRequestDurationSeconds.observe({ method, route, code: statusCode }, durationSeconds);
        httpRequestsTotal.inc({ method, route, code: statusCode });
        httpRequestsInProgress.dec({ method, route });
      }),
    );
  }
}
