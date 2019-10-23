import Bee from 'bee-queue';
import EnrollmentMail from '../app/jobs/EnrollmentMail';
import redisConfig from '../config/redis';

const jobs = [EnrollmentMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      // bee.process(handle);
      bee.on('failed', (_, err) => console.log(err)).process(handle);
    });
  }
}

export default new Queue();
