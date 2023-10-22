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
import { In, Repository } from 'typeorm';
import { UserPublicProfileResponseDto } from '../users/dto/responce/user-public-profile-response.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(
    createWishDto: CreateWishDto,
    user: UserPublicProfileResponseDto,
  ) {
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
            offers: {
              user: true,
            },
            wishes: true,
            wishlists: true,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(`Not found wish. ${e}`);
    }
  }

  async findAllByIds(ids: number[]) {
    try {
      return await this.wishesRepository.find({
        where: { id: In(ids) },
      });
    } catch (e) {
      throw new NotFoundException(`Not found wishes. ${e}`);
    }
  }
  async update(user: User, id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(id);
    if (user.id === wish.owner.id) {
      const updatedWish = await this.wishesRepository.update(id, updateWishDto);
      if (updatedWish.affected === 0) {
        throw new NotFoundException(`Not can update wish with ${id}`);
      } else {
        return {};
      }
    } else {
      throw new ForbiddenException('You cannot update the alien wish');
    }
  }
  async updateWishRaised(id: number, updateRaised: number) {
    const updatedWish = await this.wishesRepository.update(id, {
      raised: updateRaised,
    });
    if (updatedWish.affected === 0) {
      throw new NotFoundException(`Not can update wish with ${id}`);
    } else {
      return {};
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

  async copyWishById(user: UserPublicProfileResponseDto, id: number) {
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
        await this.wishesRepository.update(id, {
          ...wish,
          copied: wish.copied + 1,
        });
        return {};
      } catch (e) {
        throw new NotFoundException(`Server Error. ${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot copy the own wish');
    }
  }
}
