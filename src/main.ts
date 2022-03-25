import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './utils/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './utils/exception.filter';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get<LoggerService>(LoggerService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  const port = process.env.PORT;
  const config = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('Task Management API description')
    .setVersion('1.0')
    .setLicense('Licensed to Haj Mahmoud', 'https://licharstuido.com')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}
bootstrap().then();
