import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer])],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
