import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ObjectId } from 'mongoose';
import { UserDocument, UserSchema } from '../schemas/user.schema';
import { createUserDto } from 'src/dto/create-user.dto';
import { changePasswordDto } from 'src/dto/change-password-dto';

import bcrypt = require('bcryptjs');
import uuid = require('uuid');
import mailService from '../../services/mail-service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService, // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async registration(dto: createUserDto): Promise<ITokens> {
    const { login } = dto;
    const candidate = await this.userService.getUserByLogin(login);
    if (!!candidate) {
      throw new HttpException(
        'This e-mail already exists',
        HttpStatus.FORBIDDEN,
      );
    } else {
      const activationLink = uuid.v4();
      await mailService.sendActivationMail(
        login,
        `${process.env.API_URL}/auth/activate/${activationLink}`,
      );
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = (await this.userService.createUser(
        { login, password: passwordHash },
        activationLink,
      )) as any;
      const tokens = await this.generateTokens(user);
      UserSchema;
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens;
      // return true
    }
  }

  async logout(_id: ObjectId): Promise<UserDocument> {
    return this.userService.update(_id, { refreshToken: null });
  }

  async login(dto: createUserDto): Promise<ITokens> {
    const { login, password } = dto;
    const user = (await this.userService.getUserByLogin(login)) as any;
    if (!user) {
      throw new HttpException('No user with this login', HttpStatus.FORBIDDEN);
    } else if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    } else {
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens;
    }
  }

  async refreshTokens(_id: ObjectId, refreshToken: string): Promise<ITokens> {
    const user = (await this.userService.getOne(_id)) as any;

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async fogotPassword(login: string): Promise<any> {
    const user = (await this.userService.getUserByLogin(login)) as any;
    if (!user) {
      throw new HttpException('No user with this login', HttpStatus.NOT_FOUND);
    }
    const passwordResetCode = Math.floor(100000 + Math.random() * 900000) + '';
    await mailService.sendPasswordResetMail(login, passwordResetCode);
    const passwordResetCodedHash = await bcrypt.hash(passwordResetCode, 10);
    this.userService.update(user._id, {
      passwordResetCode: passwordResetCodedHash,
    });
    await user.save();
    return new HttpException(login, HttpStatus.OK);
  }

  async resetPassword(data: changePasswordDto): Promise<void> {
    const user = (await this.userService.getUserByLogin(data.login)) as any;
    if (!user) {
      throw new HttpException('No user with this login', HttpStatus.NOT_FOUND);
    }
    const passwordResetCodedMatches = await bcrypt.compare(
      data.secretCode + '',
      user.passwordResetCode,
    );
    if (!passwordResetCodedMatches) {
      throw new HttpException('Secret Code is incorrect', HttpStatus.FORBIDDEN);
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    this.userService.update(user._id, {
      password: passwordHash,
    });
    await user.save();
    return;
  }

  async updateRefreshToken(_id: ObjectId, refreshToken: string): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(_id, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async generateTokens(user): Promise<ITokens> {
    const { login, _id, isActivated } = user;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { _id, login, isActivated },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m' },
      ),
      this.jwtService.signAsync(
        { _id, login, isActivated },
        { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '3d' },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}

type ITokens = {
  accessToken: string;
  refreshToken: string;
};
