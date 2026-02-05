import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from 'src/controllers/user.controller';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), TokenModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
