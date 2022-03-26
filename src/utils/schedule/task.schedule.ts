import { SchedulerRegistry } from '@nestjs/schedule';
import * as cron from 'cron';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskSchedule {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  addCronJob(name: string, time: string, func: Function) {
    const job = new cron.CronJob(`${time}`, () => {
      func();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }
}
