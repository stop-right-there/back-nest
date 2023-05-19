import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'winston';
import { UserCreateInputDTO } from '../dto/create_user.dto';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly logger = new Logger(UserService.name),
    private readonly config: ConfigService,
  ) {}

  async createUser(info: UserCreateInputDTO) {
    const { phone_number } = info;
    //if(!this.userRepo.uniquePhone(phone_number)) //error 처리
    const newUser = await this.userRepo.createUser(info);
    return newUser;
  }

  async getUserList() {
    const users = await this.userRepo.getUserList();
    return users;
  }
}
