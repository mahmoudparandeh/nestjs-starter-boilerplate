import { TaskStatus } from '../../../tasks/tasks-status.enum';

export interface ITask {
  title: string;
  description: string;
  status: TaskStatus;
}
