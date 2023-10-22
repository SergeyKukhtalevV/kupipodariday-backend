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
import { WishesService } from '../wishes/wishes.service';
import { UserPublicProfileResponseDto } from '../users/dto/responce/user-public-profile-response.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}
  async create(
    user: UserPublicProfileResponseDto,
    createWishlistDto: CreateWishlistDto,
  ) {
    const { itemsId, name, image } = createWishlistDto;
    try {
      const wishes = itemsId
        ? await this.wishesService.findAllByIds(createWishlistDto.itemsId)
        : [];
      return await this.wishlistRepository.save({
        items: wishes,
        owner: user,
        name,
        image,
      });
    } catch (error) {
      throw new BadRequestException(`Bad request for create wishlist`);
    }
  }

  async findAll() {
    const wishlist = await this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
      select: {
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
    if (!wishlist) {
      throw new NotFoundException('Not found wishlist');
    } else {
      return wishlist;
    }
  }

  async findOne(id: number) {
    const wishlists = await this.wishlistRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
      select: {
        owner: {
          id: true,
          createdAt: true,
          updatedAt: true,
          username: true,
          about: true,
          avatar: true,
        },
      },
    });
    if (!wishlists) {
      throw new NotFoundException('Not found wishlists');
    } else {
      return wishlists;
    }
  }

  async update(user: User, id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishList = await this.findOne(id);
    if (user.id === wishList.owner.id) {
      const updatedWishList = await this.wishlistRepository.update(
        { id },
        updateWishlistDto,
      );
      if (updatedWishList.affected === 0) {
        throw new NotFoundException(`Not can update wishList with ${id}`);
      } else {
        return {};
      }
    } else {
      throw new ForbiddenException('You cannot update the alien wishlist');
    }
  }

  async remove(user: UserPublicProfileResponseDto, id: number) {
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
