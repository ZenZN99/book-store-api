import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CartItem } from 'src/schemas/cart-item.schema';
import { Cart } from 'src/schemas/cart.schema';
import { Book } from 'src/schemas/book.schema';

@Injectable()
export class CartItemService {
  constructor(
    @InjectModel(CartItem)
    private readonly cartItemModel: typeof CartItem,
    @InjectModel(Cart)
    private readonly cartModel: typeof Cart,
    @InjectModel(Book)
    private readonly bookModel: typeof Book,
  ) {}

  async addToCart(userId: number, bookId: number): Promise<CartItem> {
    let cart = await this.cartModel.findOne({ where: { userId } });

    if (!cart) {
      cart = await this.cartModel.create({ userId } as any);
    }

    const book = await this.bookModel.findByPk(bookId);
    if (!book) {
      throw new NotFoundException('Book not found');
    }

    const existingItem = await this.cartItemModel.findOne({
      where: { cartId: cart.id, bookId },
    });

    if (existingItem) {
      throw new BadRequestException(
        'The book has already been added to the cart',
      );
    }

    const cartItem = await this.cartItemModel.create({
      cartId: cart.id,
      bookId,
      quantity: 1,
      totalPrice: book.price,
    } as any);

    return cartItem;
  }

  async updateQuantity(
    userId: number,
    cartItemId: number,
    quantity: number,
  ): Promise<CartItem> {
    const cart = await this.cartModel.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = await this.cartItemModel.findOne({
      where: { id: cartItemId, cartId: cart.id },
      include: [Book],
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) {
      await cartItem.destroy();
      throw new BadRequestException('Quantity must be at least 1');
    }

    const book = await this.bookModel.findByPk(cartItem.bookId);
    if (!book) throw new NotFoundException('Book not found');

    cartItem.totalPrice = quantity * book.price;

    await cartItem.save();

    return cartItem;
  }

  async removeCartItem(userId: number, cartItemId: number): Promise<void> {
    const cart = await this.cartModel.findOne({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    const cartItem = await this.cartItemModel.findOne({
      where: { id: cartItemId, cartId: cart.id },
    });
    if (!cartItem) throw new NotFoundException('Cart item not found');

    await cartItem.destroy();
  }

  async getCartItems(userId: number): Promise<CartItem[]> {
    const cart = await this.cartModel.findOne({
      where: { userId },
      include: [CartItem],
    });
    if (!cart) throw new NotFoundException('Cart not found');

    return cart.items;
  }
}
