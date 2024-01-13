import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { TokenPaylodInterface } from '../../interfaces/tokenPaylod.interface';

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });
  }
  async validate(payload: TokenPaylodInterface) {
    return await this.userService.findOneById(payload.userId);
  }
}
