import { CronJob } from 'cron';

export class ScheduleService {
  jobs: CronJob[] = [];

  start() {
    this.jobs.forEach((job) => job.start());

    process.on('SIGINT', () => {
      this.jobs.forEach((job) => job.stop());
      process.exit();
    });
  }

  add(job: CronJob) {
    this.jobs.push(job);

    return this;
  }

  remove(job: CronJob) {
    this.jobs = this.jobs.filter((j) => j !== job);
    job.stop();

    return this;
  }
}
