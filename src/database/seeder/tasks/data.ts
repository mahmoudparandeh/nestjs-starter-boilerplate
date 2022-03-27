import { ITask } from './task.interface';
import { TaskStatus } from '../../../tasks/tasks-status.enum';

export const tasks: ITask[] = [
  {
    title: 'task 1',
    description: 'task 1 description',
    status: TaskStatus.OPEN,
  },
  {
    title: 'task 2',
    description: 'task 2 description',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    title: 'task 3',
    description: 'task 3 description',
    status: TaskStatus.DONE,
  },
  {
    title: 'task 4',
    description: 'task 4 description',
    status: TaskStatus.OPEN,
  },
  {
    title: 'task 5',
    description: 'task 5 description',
    status: TaskStatus.IN_PROGRESS,
  },
  {
    title: 'task 6',
    description: 'task 6 description',
    status: TaskStatus.DONE,
  },
];
