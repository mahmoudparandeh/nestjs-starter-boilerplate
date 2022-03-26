import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../utils/pagination/dto/page-option.dto';
import { PageDto } from '../utils/pagination/dto/page.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';

@Controller('tasks')
@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @Query() pageOptionsDto: PageOptionsDto,
    @GetUser() user: User,
  ): Promise<PageDto<Task>> {
    return this.taskService.getTasks(filterDto, user, pageOptionsDto);
  }

  @Get('/:id')
  getTaskById(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new NotFoundException('تسکی با این id یافت نشد');
        },
      }),
    )
    id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new NotFoundException('تسکی با این id یافت نشد');
        },
      }),
    )
    id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.deleteTask(id, user);
  }

  @Patch('/:id')
  updateTask(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new NotFoundException('تسکی با این id یافت نشد');
        },
      }),
    )
    id: number,
    @GetUser() user: User,
    @Body() updateTaskDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto, user);
  }
}
