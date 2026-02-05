import {
  type CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { Table, Column, DataType, Default, Model } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'Admin',
  USER = 'User',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
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
  declare fullname: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;

  @Default(
    'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg',
  )
  @Column(DataType.STRING)
  declare avatar: CreationOptional<string>;

  @Default(
    'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194811/cover-default-image_uunwq6.jpg',
  )
  @Column(DataType.STRING)
  declare cover: CreationOptional<string>;

  @Default(UserRole.USER)
  @Column(DataType.ENUM(UserRole.ADMIN, UserRole.USER))
  declare role: CreationOptional<UserRole>;

  @Default(0)
  @Column(DataType.FLOAT)
  declare balance: CreationOptional<number>;
}
