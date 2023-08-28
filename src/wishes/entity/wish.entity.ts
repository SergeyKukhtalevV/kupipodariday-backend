import { Entity, Column, ManyToOne, ManyToMany } from 'typeorm';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entity/user.entity';
import { Offer } from '../../offers/entity/offer.entity';

@Entity()
export class Wish extends GeneralEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  description: string;

  @ManyToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column()
  copied: number;
}
