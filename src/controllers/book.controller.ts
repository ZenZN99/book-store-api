import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/guards/auth.guard';
import { Book } from 'src/schemas/book.schema';
import { BookService } from 'src/services/book.service';
import type { RequestWithUser } from 'src/types/express';

@Controller('/api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  createBook(
    @Req() req: RequestWithUser,
    @Body() data: Book,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.createBook(req.user.id, data, file);
  }

  @Put('update/:bookId')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  updateBook(
    @Param('bookId') bookId: number,
    @Body() data: Book,
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.bookService.updateBook(bookId, data, req.user, file);
  }

  @Delete('delete/:bookId')
  @UseGuards(AuthGuard)
  deleteBook(@Param('bookId') bookId: number, @Req() req: RequestWithUser) {
    return this.bookService.deleteBook(bookId, req.user);
  }

  @Get('books')
  getAllBooks() {
    return this.bookService.getAllBooks();
  }

  @Get(':bookId')
  getBookById(@Param('bookId') bookId: number) {
    return this.bookService.getBookById(bookId);
  }
}
