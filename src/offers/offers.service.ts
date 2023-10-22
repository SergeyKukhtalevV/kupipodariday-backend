import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from '../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(@AuthUser() user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);
    const totalRaised = wish.raised + createOfferDto.amount;
    if (totalRaised > wish.price) {
      throw new BadRequestException('Donate is too big, reduce the amount');
    }
    if (user.id !== wish.owner.id) {
      try {
        await this.wishesService.updateWishRaised(wish.id, totalRaised);
        await this.offerRepository.save({
          user,
          item: wish,
          amount: createOfferDto.amount,
        });
        return {};
      } catch (e) {
        throw new NotFoundException(`Server Error. ${e}`);
      }
    } else {
      throw new ForbiddenException('You cannot donate on the own wish');
    }
  }

  async findAll() {
    try {
      return await this.offerRepository.find({
        relations: {
          user: true,
          item: true,
        },
        select: {
          user: {
            id: true,
            createdAt: true,
            updatedAt: true,
            username: true,
            about: true,
            avatar: true,
            email: true,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(`Server Error. ${e}`);
    }
  }

  async findOne(id: number) {
    try {
      return await this.offerRepository.findOne({
        where: { id },
        relations: {
          user: true,
          item: true,
        },
        select: {
          user: {
            id: true,
            createdAt: true,
            updatedAt: true,
            username: true,
            about: true,
            avatar: true,
            email: true,
          },
        },
      });
    } catch (e) {
      throw new NotFoundException(`Server Error. ${e}`);
    }
  }
}
