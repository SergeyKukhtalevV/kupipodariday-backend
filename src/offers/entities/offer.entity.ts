import { Column, Entity, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../../utils/GeneralEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Offer extends GeneralEntity {
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @Column({ type: 'float' })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
