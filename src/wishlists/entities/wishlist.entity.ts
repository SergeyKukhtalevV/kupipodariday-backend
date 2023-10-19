import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { IsUrl, MaxLength, MinLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends GeneralEntity {
  @Column({ default: 'Мой вишлист' })
  @MinLength(1)
  @MaxLength(250)
  name: string;

  @Column({ default: 'https://i.pravatar.cc/150?img=3' })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish, (wish) => wish.id)
  @JoinTable()
  items: Wish[];
}
