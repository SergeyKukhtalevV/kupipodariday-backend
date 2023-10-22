import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import {
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends GeneralEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'float' })
  @IsNumber()
  price: number;

  @Column({ type: 'float', default: 0 })
  @IsPositive()
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

  @Column()
  @MinLength(1)
  @MaxLength(1024)
  @IsString()
  description: string;

  @Column({ type: 'integer', default: 0 })
  @IsPositive()
  @IsInt()
  copied: number;

  @ManyToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
