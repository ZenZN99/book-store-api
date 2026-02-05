import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartItemController } from 'src/controllers/cartItem.controller';
import { Book } from 'src/schemas/book.schema';
import { CartItem } from 'src/schemas/cart-item.schema';
import { Cart } from 'src/schemas/cart.schema';
import { CartItemService } from 'src/services/cartItem.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [SequelizeModule.forFeature([CartItem, Cart, Book]), TokenModule],
  controllers: [CartItemController],
  providers: [CartItemService],
})
export class CartItemModule {}
