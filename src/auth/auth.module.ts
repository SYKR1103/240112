import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { RedisModule } from '../redis/redis.module';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.register({}),
    RedisModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy],
})
export class AuthModule {}
