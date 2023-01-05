import { ApiProperty } from '@nestjs/swagger';

export class createUserDto {
  @ApiProperty({
    example: 'peter33@mail.com',
    description: 'user login (e-mail)',
  })
  readonly login: string;

  @ApiProperty({
    example: '123456t',
    description: 'hash-sum of password',
  })
  readonly password: string;
}
