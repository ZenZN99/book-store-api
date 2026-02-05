import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { TransactionService } from 'src/services/transaction.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/transaction')
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('transfer')
  transferBalance(
    @Req() req: RequestWithUser,
    @Body('receiverId') receiverId: number,
  ) {
    return this.transactionService.transferBalance(req.user.id, receiverId);
  }

  @Post('recharge')
  rechargeBalance(@Req() req: RequestWithUser, @Body('amount') amount: number) {
    return this.transactionService.rechargeBalance(req.user.id, amount);
  }
}
