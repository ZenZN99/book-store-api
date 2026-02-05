import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Cart } from './cart.schema';
import { Book } from './book.schema';

@Table({
  tableName: 'cart_items',
  timestamps: true,
})
export class CartItem extends Model<CartItem> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Cart)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare cartId: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare bookId: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
  })
  declare totalPrice: number;

  @BelongsTo(() => Cart)
  declare cart: Cart;

  @BelongsTo(() => Book)
  declare book: Book;
}
