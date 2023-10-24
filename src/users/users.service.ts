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
import { FindUserDto } from './dto/find-user.dto';
import { UserPublicProfileResponseDto } from './dto/responce/user-public-profile-response.dto';
import { UserProfileResponseDto } from './dto/responce/user-profile-response.dto';
import { BcryptService } from '../common/bcrypt/bcrypt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const hashPassword = await this.bcryptService.getHash(
      createUserDto.password,
      10,
    );
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
  async getInfoAboutMe(username: string): Promise<UserProfileResponseDto> {
    const user = await this.findOneByIdOrUsername('username', username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
  async getUserInfo(
    key: 'id' | 'username',
    value: number | string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.findOneByIdOrUsername(key, value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, email, ...result } = user;
    return result;
  }
  async getUserWishes(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: {
        wishes: true,
        offers: true,
        wishlists: true,
      },
    });
    if (!user.wishes) {
      throw new NotFoundException('Wishes not found');
    }
    return user.wishes;
  }
  async update(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    if (updateUserDto.password) {
      const newHashPassword = await this.bcryptService.getHash(
        updateUserDto.password,
        10,
      );
      updateUserDto = { ...updateUserDto, password: newHashPassword };
    }
    const updateResult = await this.usersRepository.update(
      user.id,
      updateUserDto,
    );
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Not can update user with ${user.id}`);
    } else {
      const updatedUser = await this.findOneByIdOrUsername('id', user.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = updatedUser;
      return result;
    }
  }

  async findMany(
    findUserDto: FindUserDto,
  ): Promise<UserPublicProfileResponseDto> {
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
