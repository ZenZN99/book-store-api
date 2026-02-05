import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BookController } from 'src/controllers/book.controller';
import { Book } from 'src/schemas/book.schema';
import { BookService } from 'src/services/book.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [SequelizeModule.forFeature([Book]), TokenModule],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
