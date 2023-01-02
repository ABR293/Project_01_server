import mongoose, { ObjectId } from 'mongoose';
import { UserInfo } from 'src/schemas/user.schema';
import { ApiProperty } from "@nestjs/swagger";


export class changePasswordDto {

  @ApiProperty({example: 'peter33@mail.com', description: 'user login (e-mail)'})
  readonly login: string;

  @ApiProperty({example: '123456t', description: 'password'
  })
  readonly password: string;

  @ApiProperty({example: '123456', description: 'secret code from e-mail'
  })
  readonly secretCode: string;
}
