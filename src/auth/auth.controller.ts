import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  UseInterceptors,
  Res,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { changePasswordDto } from 'src/dto/change-password-dto';
import { createUserDto } from 'src/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Registrate New user' })
  @ApiResponse({
    status: 200,
    description: 'access token',
    type: String,
  })
  @Post('/registration')
  @UseInterceptors(FileFieldsInterceptor([]))
  async registration(
    @Res({ passthrough: true }) res,
    @Body() dto: createUserDto,
  ) {
    const tokens = await this.authService.registration(dto);
    res.cookie('refresh', tokens.refreshToken);
    return tokens.accessToken;
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'access token',
    type: String,
  })
  @Post('/login')
  @UseInterceptors(FileFieldsInterceptor([]))
  async login(@Res({ passthrough: true }) res, @Body() dto: createUserDto) {
    const tokens = await this.authService.login(dto);
    res.cookie('refresh', tokens.refreshToken);
    return tokens.accessToken;
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200 })
  @Get('/logout')
  @UseInterceptors(FileFieldsInterceptor([]))
  logout(@Body() _id: ObjectId) {
    return this.authService.logout(_id);
  }

  @ApiOperation({ summary: 'refresh tokens' })
  @ApiResponse({
    status: 200,
    description: 'access token',
    type: String,
  })
  @Get('/refresh/:id')
  @UseInterceptors(FileFieldsInterceptor([]))
  async refresh(
    @Res({ passthrough: true }) res,
    @Req() req: any,
    @Param('id') id: ObjectId,
  ) {
    const refreshToken = req.cookies.refresh;
    const tokens = await this.authService.refreshTokens(id, refreshToken);
    res.cookie('refresh', tokens.refreshToken);
    return tokens.accessToken;
  }

  @ApiOperation({ summary: 'activate user' })
  @ApiResponse({
    status: 200,
    description: 'activate user',
  })
  @Get('/activate/:activationLink')
  async activate(@Param('activationLink') activationLink: string, @Res() res) {
    await this.userService.activateAccount(activationLink);
    return res.redirect(process.env.CLIENT_URL);
  }

  @ApiOperation({ summary: 'if usefr fogot password we send en email' })
  @ApiResponse({
    status: 200,
    description: 'send e-mail with secret code',
  })
  @Get('/fogotPassword/:login')
  fogotPassword(@Param('login') login: string) {
    return this.authService.fogotPassword(login);
  }

  @ApiOperation({ summary: 'set new Password for user' })
  @ApiResponse({
    status: 200,
    description: 'change password of User',
  })
  @Post('/resetPassword')
  @UseInterceptors(FileFieldsInterceptor([]))
  resetPassword(@Body() data: changePasswordDto) {
    return this.authService.resetPassword(data);
  }
}
