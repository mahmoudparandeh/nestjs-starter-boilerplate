import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) =>
        instanceToPlain({
          status: context.switchToHttp().getResponse().statusCode,
          timestamp: new Date().toISOString(),
          message: '',
          type: 'HttpOK',
          data,
        }),
      ),
    );
  }
}
