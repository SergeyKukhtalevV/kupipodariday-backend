import { Entity, Column, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entity/user.entity';
import { Wish } from '../../wishes/entity/wish.entity';

@Entity()
export class Offer extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column()
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
