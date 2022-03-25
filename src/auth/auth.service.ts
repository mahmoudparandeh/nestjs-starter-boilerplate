import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jw-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(userDto: UserDto): Promise<User> | null {
    const { username, password } = userDto;
    const hash = await argon2.hash(password);
    const user = this.userRepository.create({
      username,
      password: hash,
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

  async signIn(userDto: UserDto): Promise<{ accessToken: string }> {
    const { username, password } = userDto;
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (user && (await argon2.verify(user.password, password))) {
      const payload: JwtPayload = { id: user.id, username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(
        'The username or password is not correct.',
      );
    }
  }
}
