import { CronJob } from 'cron';
import { ScheduleService } from './schedule.service';
import { updatePostsStatus } from './tasks/update-posts-status';
import { CronExpression } from './cron-expression.enum';

export function startScheduleService() {
  const scheduleService = new ScheduleService();

  scheduleService
    .add(new CronJob(CronExpression.EVERY_12_HOURS, updatePostsStatus))
    .start();

  return scheduleService;
}
