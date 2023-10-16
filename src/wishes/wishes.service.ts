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
      throw new InternalServerErrorException(`Server Error. ${e}`);
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
        relations: {
          owner: {
            offers: true,
            wishes: true,
            wishlists: true,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(`Not found wish with ${id}. ${e}`);
    }
  }

  findAll() {
    return `This action returns all wishes`;
  }

  async update(user: User, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (user.id === wish.owner.id) {
      const updateWish = await this.wishesRepository.update(id, updateWishDto);
      if (updateWish.affected === 0) {
        throw new NotFoundException(`Not can update wish with ${id}`);
      } else {
        return {};
      }
    } else {
      throw new ForbiddenException('You cannot update the alien wish');
    }
  }

  async remove(user: User, id: number) {
    const wish = await this.findOne(id);
    if (user.id === wish.owner.id) {
      try {
        await this.wishesRepository.delete({ id });
        return wish;
      } catch (e) {
        throw new NotFoundException(`Server Error. ${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot delete the alien wish');
    }
  }

  async copyWishById(user: User, id: number) {
    const wish = await this.findOne(id);
    if (user.id !== wish.owner.id) {
      try {
        await this.wishesRepository.save({
          owner: user,
          name: wish.name,
          link: wish.link,
          image: wish.image,
          description: wish.description,
          price: wish.price,
          copied: wish.copied,
        });
        const updateWish = await this.wishesRepository.update(id, {
          ...wish,
          copied: wish.copied + 1,
        });
        if (updateWish.affected === 0) {
          throw new NotFoundException(`Not can update wish with ${id}`);
        }
        return {};
      } catch (e) {
        throw new NotFoundException(`Server Error. ${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot copy the own wish');
    }
  }
}
