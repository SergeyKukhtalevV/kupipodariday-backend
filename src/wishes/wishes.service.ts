import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User) {
    const { name, link, image, description, price } = createWishDto;
    try {
      if (
        await this.wishesRepository.save({
          owner: user,
          name,
          link,
          image,
          description,
          price,
          copied: 0,
          raised: 0,
        })
      ) {
        return {};
      }
    } catch (e) {
      throw new InternalServerErrorException(`Server Error. {${e}`);
    }
  }

  async getWishesBy(
    key: 'createdAt' | 'copied',
    sorting: 'DESC' | 'ASC',
    quantity: number,
  ) {
    try {
      const order = { [key]: sorting };
      return await this.wishesRepository.find({ order, take: quantity });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.wishesRepository.findOne({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  findAll() {
    return `This action returns all wishes`;
  }

  async update(id: number, updateWishDto: UpdateWishDto) {
    const updateResult = await this.wishesRepository.update(id, updateWishDto);
    if (updateResult.affected === 0) {
      throw new NotFoundException(`Not can update wish with ${id}`);
    } else {
      return {};
    }
  }

  async remove(user: User, id: number) {
    const wish = await this.findOne(id);
    if (user.id === wish.owner.id) {
      try {
        return await this.wishesRepository.delete({ id });
      } catch (e) {
        throw new NotFoundException(`Server Error. {${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot delete the alien wish');
    }
  }

  async copyWishById(user: User, id: number) {
    const copiedWish = await this.findOne(id);
    if (user.id !== copiedWish.owner.id) {
      try {
        const {
          id: wishId,
          createdAt,
          updatedAt,
          raised,
          copied,
          ...wishInfo
        } = copiedWish;
        const newWish = await this.wishesRepository.save({
          owner: user,
          ...wishInfo,
          copied: copiedWish.copied + 1,
        });
        return {};
      } catch (e) {
        throw new NotFoundException(`Server Error. {${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot copy the own wish');
    }
  }
}
