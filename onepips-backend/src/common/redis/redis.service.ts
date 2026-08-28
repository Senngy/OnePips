import {
  Injectable,
  Logger,
  OnModuleDestroy,
} from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private readonly client = new Redis(
    process.env.REDIS_URL || 'redis://localhost:6379',
  );

  constructor() {
    this.client.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.client.on('error', (error) => {
      this.logger.error('Redis connection error', error.message);
    });
  }

  async increment(
    key: string,
    windowSeconds: number,
  ): Promise<number> {
    const count = await this.client.incr(key);

    if (count === 1) {
      await this.client.expire(key, windowSeconds);
    }

    return count;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}