import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RefreshToken } from './refresh-token.entity';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { TaskSchedule } from '../utils/schedule/task.schedule';
import { FirebaseService } from '../utils/firebase-messaging/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({}),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([User, RefreshToken]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    TaskSchedule,
    FirebaseService,
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {
  constructor() {
    console.log(process.env.JWT_SECRET);
  }
}
