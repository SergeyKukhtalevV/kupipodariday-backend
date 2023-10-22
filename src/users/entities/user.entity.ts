import { Column, Entity, OneToMany } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { IsEmail, IsUrl, MaxLength, MinLength } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

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

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
}
