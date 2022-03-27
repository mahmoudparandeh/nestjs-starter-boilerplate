import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder/seeder.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get<SeederService>(SeederService);
  seeder.seed();
}
bootstrap().then();
