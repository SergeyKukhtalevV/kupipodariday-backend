import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entity/user.entity';
import { Wish } from '../../wishes/entity/wish.entity';

@Entity()
export class WishList extends GeneralEntity {
  @Column()
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column()
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.name)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
