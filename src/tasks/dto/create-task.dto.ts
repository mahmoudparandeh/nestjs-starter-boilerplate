import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsNotEmpty({
    message: 'Title should not be empty',
  })
  @ApiProperty()
  title: string;

  @IsNotEmpty({
    message: 'Description should not be empty',
  })
  @ApiProperty()
  description: string;
}
