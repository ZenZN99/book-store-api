import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from '../schemas/transaction.schema';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from 'src/schemas/cart.schema';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction)
    private readonly transactionModel: typeof Transaction,

    @InjectModel(User)
    private readonly userModel: typeof User,

    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,

    private readonly sequelize: Sequelize,
  ) {}

  async transferBalance(senderId: number, receiverId: number) {
    if (senderId === receiverId) {
      throw new BadRequestException('You cannot transfer your own balance');
    }

    return await this.sequelize.transaction(async (t) => {
      const senderCart = await this.cartModel.findOne({
        where: { userId: senderId },
        include: [{ all: true }],
        transaction: t,
      });

      if (!senderCart || !senderCart.items || senderCart.items.length === 0) {
        throw new BadRequestException('Cart empty');
      }

      const totalAmount = senderCart.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      const sender = await this.userModel.findByPk(senderId, {
        transaction: t,
      });
      const receiver = await this.userModel.findByPk(receiverId, {
        transaction: t,
      });

      if (!sender || !receiver) {
        throw new NotFoundException('No users found');
      }

      if (sender.balance < totalAmount) {
        throw new BadRequestException('Insufficient balance');
      }

      sender.balance -= totalAmount;
      receiver.balance += totalAmount;

      await Promise.all([
        sender.save({ transaction: t }),
        receiver.save({ transaction: t }),
      ]);

      const transactionRecord = await this.transactionModel.create(
        {
          senderId: sender.id,
          receiverId: receiver.id,
          amount: totalAmount,
        },
        { transaction: t },
      );

      senderCart.items = [];
      await senderCart.save({ transaction: t });

      return {
        success: true,
        transaction: transactionRecord,
        totalAmount,
      };
    });
  }

  async rechargeBalance(userId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('The amount is invalid');
    }

    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.balance += amount;
    await user.save();

    return {
      success: true,
      balance: user.balance,
    };
  }
}
