import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CartController } from 'src/controllers/cart.controller';
import { CartItem } from 'src/schemas/cart-item.schema';
import { Cart } from 'src/schemas/cart.schema';
import { CartService } from 'src/services/cart.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [SequelizeModule.forFeature([Cart, CartItem]), TokenModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
