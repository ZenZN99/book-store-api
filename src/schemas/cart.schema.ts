import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.schema';
import { CartItem } from './cart-item.schema';

@Table({
  tableName: 'carts',
  timestamps: true,
})
export class Cart extends Model<Cart> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @HasMany(() => CartItem)
  declare items: CartItem[];
}
