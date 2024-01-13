import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { TokenPaylodInterface } from '../interfaces/tokenPaylod.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.userService.findOneByEmail(loginUserDto.email);
    const ispwMatched = await user.checkPassword(loginUserDto.password);
    if (ispwMatched) return user;
  }

  public generateAccessToken(userId: string) {
    const payload: TokenPaylodInterface = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    return token;
  }

  async emailSender(email: string) {
    const verificationcode = this.generateCode();
    await this.cacheManager.set(email, verificationcode);
    await this.emailService.emailSender({
      to: email,
      subject: 'verification code is',
      text: `verification code is ${verificationcode}`,
    });
    return 'success';
  }

  async emailChecker(email: string, code: string) {
    const rcode = await this.cacheManager.get(email);
    if (code !== rcode) throw new InternalServerErrorException();
    await this.cacheManager.del(email);
    return true;
  }

  generateCode() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.ceil(Math.random() * 10);
    }
    return OTP;
  }
}
