import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CartService } from 'src/services/cart.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('user')
  getCartByUser(@Req() req: RequestWithUser) {
    return this.cartService.getCartByUser(req.user.id);
  }

  @Delete('user')
  clearCart(@Req() req: RequestWithUser) {
    return this.cartService.clearCart(req.user.id);
  }
}
