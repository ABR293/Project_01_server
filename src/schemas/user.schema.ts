import { Prop, Schema, SchemaFactory, raw} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";

export type UserInfo = {
  firstName: string;
  lastName: string;
  nikName: string;
  contacts: UserContacts
  aboutMe: string;
}
export type UserContacts = {
  email: string;
  phone: string;
}

export type UserDocument = User & Document;

@Schema()
export class User {

  @ApiProperty({example: 'peter33@mail.com', description: 'user login (e-mail)'})
  @Prop()
  login: string; //valid e-mail

  @ApiProperty({
    example: '239-103929321-03910-230-120-20138d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 
    description: 'hash-sum of password'
  })
  @Prop()
  password: string;

  @ApiProperty({example: '', description: 'is user activate his e-mail'})
  @Prop()
  activationLink: string;

  @ApiProperty({example: true, description: 'is user activate his e-mail'})
  @Prop()
  isActivated: boolean;

  @ApiProperty({example: '5', description: 'path to the avatar'})
  @Prop()
  avatar: string;

  @ApiProperty({example: 'I belewe i can fly!!', description: 'User status'})
  @Prop()
  status: string;

  @Prop(raw({
    firstName: { type: String },
    lastName: { type: String },
    nikName: { type: String },
    aboutMe: { type: String },
    contacts: raw({
      email: { type: String },
      phone: { type: String },
    }),
  })) 
  info: UserInfo;

  @ApiProperty({description: 'Users who have been added to frends'})
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Users' }] })
  frends: mongoose.Types.ObjectId[];

  @ApiProperty({description: 'User`s dialogs'})
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Dialogs' }] })
  dialogs: mongoose.Types.ObjectId[];

}


export const UserSchema = SchemaFactory.createForClass(User);