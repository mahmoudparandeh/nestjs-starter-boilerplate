import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { Task } from '../../tasks/task.entity';
import { User } from '../../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User])],
  providers: [SeederService],
})
export class SeederModule {}
