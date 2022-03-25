import { TaskStatus } from '../tasks-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTaskFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus, {
    message:
      'Data type is not valid, valid data types: OPEN, IN PROGRESS, DONE',
  })
  @ApiProperty({
    description: 'values: OPEN, IN PROGRESS, DONE',
    required: false,
    enum: TaskStatus,
  })
  status?: TaskStatus;
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'values: task title or description',
    required: false,
  })
  search?: string;
}
