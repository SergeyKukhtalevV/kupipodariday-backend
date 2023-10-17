import { BadRequestException, Injectable } from '@nestjs/common';
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
      throw new BadRequestException(`Bad request`);
    }
  }

  findAll() {
    return `This action returns all wishlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wishlist`;
  }

  update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  remove(user: User, id: number) {
    return `This action removes a #${id} wishlist`;
  }
}
