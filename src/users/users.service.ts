import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);

    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { ['id']: id } });
    if (!user) {
      throw new NotFoundException(`Not found user with ${id}`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateResult = await this.userRepository.update(
      `${id}`,
      updateUserDto,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Not can update user with ${id}`);
    }
  }
}
