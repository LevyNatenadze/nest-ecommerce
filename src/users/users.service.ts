import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash, compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import {sign} from 'jsonwebtoken';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {}

  async signup(userSignUp: UserSignUpDto): Promise<UserEntity> {
    const userExists = await this.findByEmail(userSignUp.email);
    if (userExists) {
      throw new  BadRequestException('Email already exists');
    };
    userSignUp.password = await hash(userSignUp.password, 10);
    let user = this.usersRepository.create(userSignUp);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto) {
    const userExists = await this.usersRepository
      .createQueryBuilder('users').addSelect('users.password')
      .where('users.email = :email', {email: userSignInDto.email}).getOne();

    if (!userExists) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await compare(userSignInDto.password, userExists.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }
    delete userExists.password;
    return userExists;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({id});
    if(!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({email});
  }

  async generateJwtToken(user: UserEntity) {
    return sign({id: user.id, email: user.email},
      process.env.JSON_WEB_TOKEN_SECRET, 
      {expiresIn: process.env.JSON_WEB_TOKEN_EXPIRES_IN});
  }
}

