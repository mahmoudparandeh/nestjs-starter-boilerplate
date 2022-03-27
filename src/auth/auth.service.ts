import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jw-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshToken } from './refresh-token.entity';
import { TaskSchedule } from '../utils/schedule/task.schedule';
import { FirebaseService } from '../utils/firebase-messaging/firebase.service';
import { NotificationDto } from './dto/notification.dto';
import { FirebasePayload } from '../utils/firebase-messaging/firebase-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private taskScheduler: TaskSchedule,
    private firebaseService: FirebaseService,
  ) {}

  async createUser(userDto: UserDto): Promise<User> | null {
    const { username, password } = userDto;
    const user = this.userRepository.create({
      username,
      password,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('The username is already exists.');
      }
    }
    return user;
  }

  async signIn(
    userDto: UserDto,
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const { username, password } = userDto;
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (user && (await argon2.verify(user.password, password))) {
      const payload: JwtPayload = { id: user.id, username };
      const { accessToken, refreshToken } = await this.generateTokens(
        payload,
        true,
      );
      this.taskScheduler.addCronJob('logger', '0 * * * * *', () => {
        console.log('user is logged in');
      });
      return {
        user,
        accessToken,
        refreshToken,
      };
    } else {
      throw new UnauthorizedException(
        'The username or password is not correct.',
      );
    }
  }

  async refresh(
    refreshToken: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decodedJwtAccessToken = this.jwtService.decode(
      refreshToken.refreshToken,
    );
    if (decodedJwtAccessToken['exp'] < Math.floor(Date.now() / 1000)) {
      throw new ForbiddenException(
        'Your refresh token is expired, please sign in again',
      );
    }
    const refreshTokenEntities = await this.refreshTokenRepository.find({
      where: {
        userId: decodedJwtAccessToken['id'],
      },
    });
    const refreshTokenEntityIndex = refreshTokenEntities.findIndex(
      async (entity) =>
        await argon2.verify(entity.refreshToken, refreshToken.refreshToken),
    );
    if (refreshTokenEntities) {
      const payload: JwtPayload = {
        id: decodedJwtAccessToken['id'],
        username: decodedJwtAccessToken['username'],
      };
      const { accessToken, refreshToken } = await this.generateTokens(
        payload,
        false,
      );
      const refreshTokenHash = await argon2.hash(refreshToken);
      await this.refreshTokenRepository.update(
        { id: refreshTokenEntities[refreshTokenEntityIndex].id },
        {
          refreshToken: refreshTokenHash,
        },
      );
      return { accessToken, refreshToken };
    } else {
      throw new NotFoundException('Your Refresh Token is not valid');
    }
  }

  async generateTokens(
    payload: JwtPayload,
    isSaveToken: boolean,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: 900,
    });
    const refreshToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: 2628000,
    });
    if (isSaveToken) {
      const refreshTokenHash = await argon2.hash(refreshToken);
      const refreshTokenEntity = this.refreshTokenRepository.create({
        userId: payload.id,
        refreshToken: refreshTokenHash,
      });
      await this.refreshTokenRepository.save(refreshTokenEntity);
    }
    return { accessToken, refreshToken };
  }

  async sendNotification(notificationDto: NotificationDto): Promise<void> {
    const { fcmToken, title, body } = notificationDto;
    const data: FirebasePayload = {
      notification: {
        title,
        body,
      },
    };
    await this.firebaseService.sendMessageToDevice(fcmToken, data);
  }
}
