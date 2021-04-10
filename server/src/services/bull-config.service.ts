import { Injectable } from '@nestjs/common';
import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

import { QueueOptions } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private client: Redis.Redis;

  private subscriber: Redis.Redis;

  constructor(private readonly configService: ConfigService) {}

  createSharedConfiguration(): Promise<QueueOptions> | QueueOptions {
    const url = this.configService.get<string>('bull.redis.url');

    // reuse connections
    // see more: https://github.com/OptimalBits/bull/blob/master/PATTERNS.md#reusing-redis-connections
    this.client = new Redis(url);
    this.subscriber = new Redis(url);

    return {
      createClient: (type) => {
        switch (type) {
          case 'client':
            return this.client;
          case 'subscriber':
            return this.subscriber;
          default:
            return new Redis(url);
        }
      },
    };
  }
}
