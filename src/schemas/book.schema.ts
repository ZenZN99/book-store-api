import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  Table,
  Column,
  DataType,
  ForeignKey,
  Model,
} from 'sequelize-typescript';
import { User } from './user.schema';

@Table({
  tableName: 'books',
  timestamps: true,
})
export class Book extends Model<
  InferAttributes<Book>,
  InferCreationAttributes<Book>
> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: CreationOptional<number>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  declare stock: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare image: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare category: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;
}
