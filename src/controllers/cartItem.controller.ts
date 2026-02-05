import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CartItemService } from 'src/services/cartItem.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/cartItem')
@UseGuards(AuthGuard)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('add/:bookId')
  addToCart(@Req() req: RequestWithUser, @Param('bookId') bookId: number) {
    return this.cartItemService.addToCart(req.user.id, bookId);
  }

  @Put('update/:cartItemId')
  updateQuantity(
    @Req() req: RequestWithUser,
    @Param('cartItemId') cartItemId: number,
    @Body('quantity') quantity: number,
  ) {
    return this.cartItemService.updateQuantity(
      req.user.id,
      cartItemId,
      quantity,
    );
  }

  @Delete('delete/:cartItemId')
  removeCartItem(
    @Req() req: RequestWithUser,
    @Param('cartItemId') cartItemId: number,
  ) {
    return this.cartItemService.removeCartItem(req.user.id, cartItemId);
  }

  @Get('items')
  getCartItems(@Req() req: RequestWithUser) {
    return this.cartItemService.getCartItems(req.user.id);
  }
}
