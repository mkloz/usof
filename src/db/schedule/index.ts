import { backupService } from '@/db/schedule/dump/backup.service';
import { CronJob } from 'cron';
import { CronExpression } from './cron-expression.enum';
import { ScheduleService } from './schedule.service';
import { updatePostsStatus } from './tasks/update-posts-status';

export function startScheduleService() {
  const scheduleService = new ScheduleService();
  const jobs = [
    new CronJob(CronExpression.EVERY_12_HOURS, updatePostsStatus),
    new CronJob(CronExpression.EVERY_HOUR, () => backupService.downloadData()),
    new CronJob(CronExpression.EVERY_6_HOURS, () =>
      backupService.downloadSchema(),
    ),
    new CronJob(CronExpression.EVERY_3_HOURS, () =>
      backupService.downloadTriggers(),
    ),
  ];

  jobs.forEach((job) => scheduleService.add(job));

  scheduleService.start();

  return scheduleService;
}
