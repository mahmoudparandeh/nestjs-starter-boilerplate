import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.setGlobalPrefix('api/v1');
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
  logger.log(`Application is listening on port ${port}`);
}
bootstrap().then();
