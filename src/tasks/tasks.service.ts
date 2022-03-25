import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/user.entity';
import { PageOptionsDto } from '../utils/pagination/dto/page-option.dto';
import { PageDto } from '../utils/pagination/dto/page.dto';
import { PageMetaDto } from '../utils/pagination/dto/page-meta.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async getTasks(
    filterDto: GetTaskFilterDto,
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Task>> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    query.where({ user });
    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search and LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    query.take(pageOptionsDto.pageSize);
    query.skip(pageOptionsDto.skip);
    const itemCount = await query.getCount();
    const tasks = await query.getMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(tasks, pageMetaDto);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        user,
      },
    });
    if (!found) {
      throw new NotFoundException('Task with given id is not found');
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTask(id: number, user: User): Promise<Task> {
    const found = await this.getTaskById(id, user);
    await this.taskRepository.delete(found.id);
    return found;
  }

  async updateTask(
    id: number,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);
    found.status = updateTaskStatusDto.status;
    await this.taskRepository.save(found);
    return found;
  }
}
