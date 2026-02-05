import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Book } from 'src/schemas/book.schema';
import { User, UserRole } from 'src/schemas/user.schema';
import { uploadToCloudinary } from 'src/utils/cloudinary';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book) private readonly bookModel: typeof Book) {}

  async createBook(
    userId: number,
    data: Partial<Book>,
    file: Express.Multer.File,
  ) {
    const { title, description, price, stock, category } = data;
    if (!title || !description || !price || !category) {
      throw new BadRequestException('All fields is required');
    }
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (isNaN(priceNumber) || isNaN(stockNumber)) {
      throw new BadRequestException('Price and stock must be numbers');
    }

    if (priceNumber < 1 || stockNumber < 1) {
      throw new BadRequestException('The value must be greater than zero.');
    }

    const upload = await uploadToCloudinary(file, 'books');

    const book = await this.bookModel.create({
      title: data.title as string,
      description: data.description as string,
      price: priceNumber,
      stock: stockNumber,
      category: data.category as string,
      userId: userId,
      image: upload.secure_url,
    });

    return book;
  }

  async getAllBooks() {
    return await this.bookModel.findAll();
  }

  async getBookById(bookId: number) {
    const book = await this.bookModel.findByPk(bookId);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    return book;
  }

  async updateBook(
    bookId: number,
    data: Partial<Book>,
    user: User,
    file?: Express.Multer.File,
  ) {
    const book = await this.getBookById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    const isOwner = book.userId === user.id;
    const isAdmin = user.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not allowed to update this book');
    }

    if (data.price !== undefined) {
      const priceNumber = Number(data.price);
      if (isNaN(priceNumber) || priceNumber < 1) {
        throw new BadRequestException('Invalid price value');
      }
      data.price = priceNumber;
    }

    if (data.stock !== undefined) {
      const stockNumber = Number(data.stock);
      if (isNaN(stockNumber) || stockNumber < 1) {
        throw new BadRequestException('Invalid stock value');
      }
      data.stock = stockNumber;
    }

    if (file) {
      const upload = await uploadToCloudinary(file, 'books');
      data.image = upload.secure_url;
    }

    await book.update(data);
    return book;
  }

  async deleteBook(bookId: number, currentUser: User) {
    const book = await this.getBookById(bookId);

    if (!book) {
      throw new NotFoundException('Book not found!');
    }

    const isOwner = book.userId === currentUser.id;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this book');
    }

    await book.destroy();

    return { message: 'Book deleted successfully' };
  }
}
