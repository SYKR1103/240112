import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RequestWithUser } from '../interfaces/requestWithUser';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }
  //
  // @Post('/login')
  // async loginUser(loginUserDto: LoginUserDto) {
  //   const user = await this.authService.loginUser(loginUserDto);
  //   const token = await this.authService.generateAccessToken(user.id);
  //   return { user, token };
  // }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(@Req() req: RequestWithUser) {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @Post('/email/send')
  async emailSender(@Body('email') email: string) {
    return await this.authService.emailSender(email);
  }
  @Post('/email/check')
  async emailChecker(@Body('email') email: string, @Body('code') code: string) {
    return await this.authService.emailChecker(email, code);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    return await HttpStatus.OK;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: RequestWithUser) {
    const { user } = req;
    return user;
  }
}
