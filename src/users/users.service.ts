import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, QueryFailedError, Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';

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
    const user = this.usersRepository.create(createUserDto);
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      if (e instanceof QueryFailedError) {
        throw new BadRequestException(
          'The user with this email or username is already registered',
        );
      } else {
        throw new InternalServerErrorException(`Server error. ${e}`);
      }
    }
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, ...result } = user;
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

  async findMany(findUserDto: FindUserDto) {
    const user = await this.usersRepository.findOne({
      where: [
        { email: Like(`${findUserDto.query}`) },
        { username: Like(`${findUserDto.query}`) },
      ],
    });
    if (!user) {
      throw new NotFoundException(`Not found user with ${findUserDto.query}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, ...result } = user;
    return result;
  }
}
