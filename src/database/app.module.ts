import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SeederModule } from './seeder/seeder.module';
import { TypeOrmSeedConfigService } from '../utils/typeorm.seed.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmSeedConfigService }),
    SeederModule,
  ],
})
export class AppModule {}
