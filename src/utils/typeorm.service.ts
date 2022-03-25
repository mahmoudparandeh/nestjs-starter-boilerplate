import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: process.env.DATABASE_DRIVER,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: ['dist/**/*.entity.{ts,js}'],
      migrations: ['dist/migrations/*.{ts,js}'],
      migrationsTableName: 'migrations_history',
      logger: 'file',
      synchronize: process.env.SYNC, // never use TRUE in production!
    };
  }
}
