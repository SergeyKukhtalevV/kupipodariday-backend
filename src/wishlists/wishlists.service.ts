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
    });
    if (!wishlists) {
      throw new NotFoundException('Not found wishlists');
    } else {
      return wishlists;
    }
  }

  async update(
    user: UserPublicProfileResponseDto,
    id: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishList = await this.findOne(id);
    const { itemsId, name, image } = updateWishlistDto;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.id === wishList.owner.id) {
      const wishes = itemsId
        ? await this.wishesService.findAllByIds(updateWishlistDto.itemsId)
        : [];
      const updatedWishList = await this.wishlistRepository.update(id, {
        name,
        image,
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

  async remove(user: UserPublicProfileResponseDto, id: number) {
    const wishlist = await this.findOne(id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
