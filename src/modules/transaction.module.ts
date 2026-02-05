import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionService } from 'src/services/transaction.service';
import { User } from 'src/schemas/user.schema';
import { Cart } from 'src/schemas/cart.schema';
import { TransactionController } from 'src/controllers/transaction.controller';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [SequelizeModule.forFeature([Transaction, User, Cart]), TokenModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
