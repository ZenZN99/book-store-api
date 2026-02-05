import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { User, UserRole } from 'src/schemas/user.schema';
import { TokenService } from 'src/token/token.service';
import { UpdateProfileResponse } from 'src/types/update-profile-res';
import cloudinary, { uploadToCloudinary } from 'src/utils/cloudinary';
import validator from 'validator';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
    private tokenService: TokenService,
  ) {}

  async signup(data: Partial<User>) {
    const { fullname, email, password } = data;

    switch (true) {
      case !fullname || !email || !password:
        throw new BadRequestException('All fields are required');
      case !validator.isEmail(email as string):
        throw new BadRequestException('Invalid Email address');
      case password!.length < 8:
        throw new BadRequestException(
          'The password must be at least 8 characters long',
        );
      case password!.length > 40:
        throw new BadRequestException(
          'The maximum password length is 40 characters',
        );
    }

    const existingUser = await this.userModel.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 13);

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    const newUser = await this.userModel.create({
      fullname,
      email,
      password: hashedPassword,
      balance: 0,
      avatar:
        'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194734/avatar-default-image_yc4xy4.jpg',
      cover:
        'https://res.cloudinary.com/dgagbheuj/image/upload/v1763194811/cover-default-image_uunwq6.jpg',
      role: isAdmin ? UserRole.ADMIN : UserRole.USER,
    });

    const token = this.tokenService.generateToken({
      id: newUser.id,
      role: newUser.role,
    });

    return {
      success: 'Account created successfully',
      user: {
        id: newUser.id,
        fullname: newUser.fullname,
        email: newUser.email,
        avatar: newUser.avatar,
        cover: newUser.cover,
        role: newUser.role,
        balance: newUser.balance,
      },
      token,
    };
  }

  async login(data: Partial<User>) {
    const { email, password } = data;

    if (!email || !password) {
      throw new BadRequestException('All fields are required');
    }

    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('Email is not registred');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.tokenService.generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      success: 'Logged in successfully',
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        role: user.role,
        balance: user.balance,
      },
      token,
    };
  }

  async me(userId: number) {
    const user = await this.userModel.findByPk(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      cover: user.cover,
      balance: user.balance,
    };
  }

  async updateProfile(
    authUser: { id: number },
    files: { avatar?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ): Promise<UpdateProfileResponse> {
    if (!authUser?.id) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userModel.findByPk(authUser.id);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const avatarFile = files?.avatar?.[0];
    const coverFile = files?.cover?.[0];

    const updatedData: Partial<User> = {};

    const extractPublicId = (url: string): string => {
      const parts = url.split('/');
      const file = parts.pop()!;
      return file.split('.')[0];
    };

    if (avatarFile) {
      if (user.avatar?.includes('res.cloudinary.com')) {
        const oldId = extractPublicId(user.avatar);
        await cloudinary.v2.uploader.destroy(`users/avatars/${oldId}`);
      }

      const avatarUpload = await uploadToCloudinary(
        avatarFile,
        'users/avatars',
      );

      updatedData.avatar = avatarUpload.secure_url;
    }

    if (coverFile) {
      if (user.cover?.includes('res.cloudinary.com')) {
        const oldId = extractPublicId(user.cover);
        await cloudinary.v2.uploader.destroy(`users/covers/${oldId}`);
      }

      const coverUpload = await uploadToCloudinary(coverFile, 'users/covers');

      updatedData.cover = coverUpload.secure_url;
    }

    await user.update(updatedData);

    return {
      success: 'Profile updated successfully',
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        cover: user.cover,
        role: user.role,
        balance: user.balance,
      },
    };
  }

  async getAllUsers(authUser: User) {
    if (!authUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    return this.userModel.findAll({
      where: {
        id: {
          [Op.ne]: authUser.id,
        },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async getUserById(authUser: User, id: number) {
    if (!authUser) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async deleteUserById(authUser: User, id: number) {
    if (!authUser || authUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Admins only');
    }

    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await user.destroy();

    return { success: 'User deleted successfully' };
  }
}
