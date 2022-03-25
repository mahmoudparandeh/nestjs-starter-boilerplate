import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    await this.loggerService.logExceptions(request, exception);
    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      message: exception.getResponse()['message'],
      type: exception.name,
      data: null,
    });
  }
}
