import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from './logger.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logs) private logRepository: Repository<Logs>,
    private jwtService: JwtService,
  ) {}

  async logExceptions(
    request: Request,
    exception: HttpException,
  ): Promise<void> {
    const status = exception.getStatus();
    const error = exception.message;
    const type = exception.name;
    const stack = exception.stack;
    const ip = request.ip;
    const userAgent = request.header('User-Agent');
    const requestPath = request.path;
    const body = JSON.stringify(request.body);
    const query = JSON.stringify(request.query);
    const auth = request.header('Authorization');
    const jwt = auth.split(' ');
    const decodedJwtAccessToken = this.jwtService.decode(jwt[1]);
    const log = this.logRepository.create({
      ip,
      status,
      error,
      stack,
      type,
      body,
      auth,
      query,
      userId: decodedJwtAccessToken['id'],
      userAgent,
      request: requestPath,
    });
    await this.logRepository.save(log);
  }
}
