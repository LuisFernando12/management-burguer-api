import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService extends Redis {
  constructor() {
    super(6379, process.env.REDIS_ENDPOINT || '127.0.0.1');
    this.on('connect', () => {
      console.log('Connected to Redis');
    });
    this.on('error', (error) => {
      console.error('Error connecting to Redis:', error);
    });
  }
}
// export class RedisService
//   extends Redis
//   implements OnModuleInit, OnModuleDestroy
// {
//   async onModuleInit() {
//     await this.connect();
//   }
//   async onModuleDestroy() {
//     await this.quit();
//   }
// }
