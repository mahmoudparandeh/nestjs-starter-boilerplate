import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accessToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  refreshToken: string;
}
