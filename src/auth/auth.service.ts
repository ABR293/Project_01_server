import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/files/file.service';
import { UserService } from 'src/user/user.service';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument, UserSchema, UserType } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from 'src/dto/create-user.dto';
import { UserModule } from 'src/user/user.module';

var bcrypt = require('bcryptjs');
const uuid = require('uuid')
const mailService = require('../../services/mail-service')

@Injectable()
export class AuthService {
    constructor(
        private  userService: UserService,
        private jwtService: JwtService,

    // @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async registration(dto: createUserDto): Promise<any> {
    const {login} = dto
    const candidate = await this.userService.getUserByLogin(login)
    if(!!candidate){
      throw new HttpException('user already have account', HttpStatus.FORBIDDEN) 
    } else {
      const activationLink = uuid.v4()
      await mailService.sendActivationMail(login, `${process.env.API_URL}/auth/activate/${activationLink}`)
      const passwordHash = await bcrypt.hash(dto.password, 10);
      const user = await this.userService.createUser({login, password:passwordHash}, activationLink) as any
      const tokens = await this.generateTokens(user);
      UserSchema
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens
      // return true
    }
  }

  async logout(_id: ObjectId) {
    return this.userService.update(_id, { refreshToken: null });
  }

  async login (dto: createUserDto ){
    const {login, password} = dto
    const user = await this.userService.getUserByLogin(login) as any
    if(!user){
      throw new HttpException('no user with this email', HttpStatus.FORBIDDEN) 
    } else if( !await bcrypt.compare(password, user.password) ){
      throw new HttpException('wrong password', HttpStatus.FORBIDDEN) 
    } else {
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user._id, tokens.refreshToken);
      return tokens
    }
  }

  async refreshTokens(_id: ObjectId, refreshToken: string) {
    const user = await this.userService.getOne(_id) as any

    if (!user || !user.refreshToken){
      throw new ForbiddenException('Access Denied');    
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied')
    };
    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(_id: ObjectId, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(_id, {
      refreshToken: hashedRefreshToken,
    });
  }

  private async generateTokens(user) {
    const {login, _id, isActivated,} = user
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {_id, login, isActivated},
        {secret: process.env.JWT_ACCESS_SECRET, expiresIn: '10m'},
      ),
      this.jwtService.signAsync(
        {_id, login, isActivated },
        {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '3d'},
      ),
    ]);
    return {accessToken, refreshToken};
  }
}
