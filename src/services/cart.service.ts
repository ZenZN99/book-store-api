import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cart } from 'src/schemas/cart.schema';
import { CartItem } from 'src/schemas/cart-item.schema';
import { Book } from 'src/schemas/book.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,
    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,
  ) {}

  async getCartByUser(userId: number): Promise<Cart> {
    const cart = await this.cartModel.findOne({
      where: { userId },
      include: [{ model: CartItem, include: [Book] }],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found for this user');
    }

    return cart;
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.cartModel.findOne({ where: { userId } });
    if (!cart) {
      throw new BadRequestException('Cart not found!');
    }

    await this.cartItemModel.destroy({ where: { cartId: cart.id } });
  }
}
