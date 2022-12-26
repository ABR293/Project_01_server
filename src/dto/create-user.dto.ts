import mongoose, { ObjectId } from 'mongoose';
import { UserInfo } from 'src/schemas/user.schema';
import { ApiProperty } from "@nestjs/swagger";


export class createUserDto {

  @ApiProperty({example: 'peter33@mail.com', description: 'user login (e-mail)'})
  readonly login: string;

  @ApiProperty({
    example: '239-103929321-03910-230-120-20138d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 
    description: 'hash-sum of password'
  })
  readonly password: string;
}
