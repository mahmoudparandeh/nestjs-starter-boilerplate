import { IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty({
    message: 'Username should not be empty',
  })
  @Length(4, 20, {
    message: 'Username should be between 4 and 20 characters',
  })
  @ApiProperty()
  username: string;

  @IsNotEmpty({
    message: 'Password should not be empty',
  })
  @Length(8, 32, {
    message: 'Password should be between 8 and 32 characters',
  })
  @ApiProperty()
  password: string;
}
