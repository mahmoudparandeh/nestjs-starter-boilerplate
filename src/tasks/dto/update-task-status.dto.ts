import { TaskStatus } from '../tasks-status.enum';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus, {
    message:
      'Data type is not valid, valid data types: OPEN, IN PROGRESS, DONE',
  })
  @ApiProperty({
    description: 'values: OPEN, IN PROGRESS, DONE',
    enum: TaskStatus,
  })
  status: TaskStatus;
}
