import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}
  async create(user: User, createWishlistDto: CreateWishlistDto) {
    try {
      const wishes = createWishlistDto.items
        ? await this.wishesService.findAllByIds(createWishlistDto.items)
        : [];
      return await this.wishlistRepository.save({
        items: wishes,
        owner: user,
        createWishlistDto,
      });
    } catch (error) {
      throw new BadRequestException(`Bad request for create wishlist`);
    }
  }

  async findAll() {
    try {
      return await this.wishlistRepository.find({
        relations: ['owner', 'items'],
      });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async findOne(id: number) {
    try {
      return await this.wishlistRepository.findOne({
        where: { id },
        relations: {
          items: true,
          owner: true,
        },
      });
    } catch (e) {
      throw new NotFoundException(`Not found wishlist. ${e}`);
    }
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishList = await this.findOne(id);
    if (user.id === wishList.owner.id) {
      const wishes = updateWishlistDto.items
        ? await this.wishesService.findAllByIds(updateWishlistDto.items)
        : [];
      const updatedWishList = await this.wishlistRepository.update(id, {
        name: updateWishlistDto.name,
        image: updateWishlistDto.image,
        items: wishes,
      });
      if (updatedWishList.affected === 0) {
        throw new NotFoundException(`Not can update wishList with ${id}`);
      } else {
        return {};
      }
    } else {
      throw new ForbiddenException('You cannot update the alien wishlist');
    }
  }

  async remove(user: User, id: number) {
    const wishlist = await this.findOne(id);
    if (user.id === wishlist.owner.id) {
      try {
        await this.wishlistRepository.delete({ id });
        return wishlist;
      } catch (e) {
        throw new NotFoundException(`Server Error. ${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot delete the alien wishlist');
    }
  }
}
