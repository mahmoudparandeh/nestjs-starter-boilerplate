import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/user.entity';
import { Repository } from 'typeorm';
import { users } from './users/data';
import { tasks } from './tasks/data';
import { Task } from '../../tasks/task.entity';

@Injectable()
export class SeederService {
  users = [];
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async seed() {
    await this.seedUsers(process.env.NODE_ENV);
    await this.seedTasks(process.env.NODE_ENV);
    console.log('Seeding complete!');
  }

  async seedUsers(config: string) {
    if (config === 'development') {
      await this.userRepository.query(
        `TRUNCATE "user" RESTART IDENTITY CASCADE;`,
      );
      for (let i = 0; i < users.length; i++) {
        const userEntity = this.userRepository.create({
          username: users[i].username,
          password: users[i].password,
        });
        const userObject = await this.userRepository.save(userEntity);
        this.users.push(userObject);
      }
    }
  }

  async seedTasks(config: string) {
    if (config === 'development') {
      await this.taskRepository.query(
        `TRUNCATE "task" RESTART IDENTITY CASCADE;`,
      );
      for (let i = 0; i < tasks.length; i++) {
        const taskEntity = this.taskRepository.create({
          title: tasks[i].title,
          description: tasks[i].description,
          status: tasks[i].status,
          user: this.users[Math.floor(Math.random() * this.users.length)],
        });
        await this.taskRepository.save(taskEntity);
      }
    }
  }
}
