import { Entity, Column, OneToMany } from 'typeorm';
import { IsEmail, IsUrl, MaxLength, MinLength } from 'class-validator';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { Wish } from '../../wishes/entity/wish.entity';
import { WishList } from '../../wishlists/entity/wishlist.entity';
import { Offer } from '../../offers/entity/offer.entity';

@Entity()
export class User extends GeneralEntity {
  @Column({ unique: true })
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @MinLength(2)
  @MaxLength(200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => WishList, (wishlist) => wishlist.owner)
  wishlists: WishList[];
}
