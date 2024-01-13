import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const newuser = await this.userRepo.create(createUserDto);
    await this.userRepo.save(newuser);
    return newuser;
  }

  async findOneById(id: string) {
    const founduser = await this.userRepo.findOneBy({ id });
    if (!founduser)
      throw new HttpException('not created', HttpStatus.NOT_FOUND);
    return founduser;
  }

  async findOneByEmail(email: string) {
    const founduser = await this.userRepo.findOneBy({ email });
    if (!founduser)
      throw new HttpException('not created', HttpStatus.NOT_FOUND);
    return founduser;
  }
}
