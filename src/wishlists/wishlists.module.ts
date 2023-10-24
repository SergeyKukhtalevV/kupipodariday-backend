import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';
import { BcryptModule } from '../common/bcrypt/bcrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, User, Wish]), BcryptModule],
  controllers: [WishlistsController],
  providers: [WishlistsService, UsersService, WishesService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
