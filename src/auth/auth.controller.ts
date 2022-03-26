import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() userDto: UserDto): Promise<User> | null {
    return this.authService.createUser(userDto);
  }

  @Post('/signin')
  signIn(
    @Body() userDto: UserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.signIn(userDto);
  }

  @Post('/refresh')
  refresh(
    @Headers() headers: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken: RefreshTokenDto = {
      accessToken: headers['accesstoken'],
      refreshToken: headers['refreshtoken'],
    };
    return this.authService.refresh(refreshToken);
  }
}
