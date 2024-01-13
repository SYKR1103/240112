import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as RedisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        store: RedisStore,
        host: cfg.get('REDIS_HOST'),
        port: cfg.get('REDIS_PORT'),
        user: cfg.get('REDIS_USER'),
        password: cfg.get('REDIS_PASSWORD'),
        ttl: cfg.get('REDIS_TTL'),
      }),
      isGlobal: true,
    }),
  ],
})
export class RedisModule {}
