import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  createUser(@Body() userDto: UserDto): Promise<User> | null {
    return this.authService.createUser(userDto);
  }

  @Post('/signin')
  signIn(@Body() userDto: UserDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(userDto);
  }
}
