import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const hashPassword = await hash(createUserDto.password, 10);
    return this.create({ ...createUserDto, password: hashPassword });
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);

    return this.usersRepository.save(user);
  }

  async findAll() {
    return this.usersRepository.find();
  }

  async findOneByIdOrUsername(key: 'id' | 'username', value: number | string) {
    const user = await this.usersRepository.findOne({
      where: { [key]: value },
    });
    if (!user) {
      throw new NotFoundException(`Not found user with ${value}`);
    }
    return user;
  }

  async getUserInfo(key: 'id' | 'username', value: number | string) {
    const user = await this.findOneByIdOrUsername(key, value);
    const { password, ...result } = user;
    return result;
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const newHashPassword = await hash(updateUserDto.password, 10);
      updateUserDto = { ...updateUserDto, password: newHashPassword };
    }
    const updateResult = await this.usersRepository.update(
      user.id,
      updateUserDto,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Not can update user with ${user.id}`);
    } else {
      return this.findOneByIdOrUsername('id', user.id);
    }
  }
}
