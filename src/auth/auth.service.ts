import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FileService } from 'src/files/file.service';
import { UserService } from 'src/user/user.service';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from 'src/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
// import { MailerService } from '@nestjs-modules/mailer';

const uuid = require('uuid')
const mailService = require('../../services/mail-service')

@Injectable()
export class AuthService {
    

    constructor(
        private  userService: UserService,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,

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
      .then(() => {console.log('Mail_Sended')})
      .catch((err) => {console.log('Mail_NOT_Sended', err )});
      
      const user = await this.userService.createUser(dto, activationLink);
      return this.generateToken(user);
      // return true
    }
  }

  async login (dto: createUserDto ){
    const {login, password} = dto
    const user = await this.userService.getUserByLogin(login)
    if(!user){
      throw new HttpException('no user with this email', HttpStatus.FORBIDDEN) 
    } else if( user.password !== password){
      throw new HttpException('wrong password', HttpStatus.FORBIDDEN) 
    } else {
        return this.generateToken(user);
    }

  }

  private async generateToken(user:any){
    const {login, _id} = user
    const payload = {login, _id}
    return this.jwtService.sign(payload)
  }

}
