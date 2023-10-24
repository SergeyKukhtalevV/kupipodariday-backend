import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from '../users/entities/user.entity';
import { Offer } from '../offers/entities/offer.entity';
import { UsersService } from '../users/users.service';
import { BcryptModule } from '../common/bcrypt/bcrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer]), BcryptModule],
  controllers: [WishesController],
  providers: [WishesService, UsersService],
  exports: [WishesService],
})
export class WishesModule {}
