import { Injectable } from '@nestjs/common';
import { SharedBullConfigurationFactory } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';

import { QueueOptions } from 'bull';
import Redis from 'ioredis';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  private client: Redis.Redis;

  private subscriber: Redis.Redis;

  private connections: Redis.Redis[] = [];

  constructor(private readonly configService: ConfigService) {}

  public closeConnections() {
    this.client.disconnect();
    this.subscriber.disconnect();

    for (const i of this.connections) {
      i.disconnect();
    }
  }

  public createSharedConfiguration(): Promise<QueueOptions> | QueueOptions {
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
          default: {
            const connection = new Redis(url);
            this.connections.push(connection);
            return connection;
          }
        }
      },
    };
  }
}
