import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports:[
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    forwardRef(() => UserModule),
    JwtModule.register({
      privateKey: process.env.RIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '5h'
      }
    })
  ],
  exports:[
    AuthService,
    JwtModule,
  ]
})
export class AuthModule {}
