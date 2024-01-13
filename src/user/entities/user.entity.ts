import { BaseEntity } from '../../common/base.common';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
@Entity()
export class User extends BaseEntity {
  @Column()
  public nickname: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @BeforeInsert()
  async hashPassword() {
    try {
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string) {
    const isMatched = await bcrypt.compare(aPassword, this.password);
    if (!isMatched)
      throw new HttpException('wrong password', HttpStatus.BAD_REQUEST);
    return isMatched;
  }
}
