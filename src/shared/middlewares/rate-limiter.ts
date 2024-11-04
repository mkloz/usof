import { cs } from '@/config/api-config.service';
import rateLimit from 'express-rate-limit';

const throttle = cs.getThrottle();

export const limiter = rateLimit({
  windowMs: throttle.ttl,
  limit: throttle.limit,
});
