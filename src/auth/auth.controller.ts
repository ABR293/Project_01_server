import {
    Body,
    Param,
    Controller,
    Delete,
    Get,
    Post,
    UseInterceptors,
    UploadedFiles,
    Query,
    Put,
    Res,
    Req,
  } from '@nestjs/common';
  import { FileFieldsInterceptor } from '@nestjs/platform-express';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import mongoose, { ObjectId } from 'mongoose';
  import { Track } from 'src/schemas/track.schema';
  import { Comment } from 'src/schemas/comment.schema';
  import { createCommentDto } from '../dto/create-comment.dto';
  import { createTrackDto } from '../dto/create-track.dto';
import { createUserDto } from 'src/dto/create-user.dto';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
//   import { TrackService } from './track.service';
  

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}


  @ApiOperation({summary: 'Registrate New user'})
    @ApiResponse({status: 200})
    @Post('/registration')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    async registration(@Res({ passthrough: true }) res, @Body() dto: createUserDto) { 
      const tokens = await this.authService.registration(dto);
      res.cookie('refresh', tokens.refreshToken)
      return tokens.accessToken
    }

  @ApiOperation({summary: 'Login user'})
    @ApiResponse({status: 200})
    @Post('/login')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    async login(@Res({ passthrough: true }) res, @Body() dto: createUserDto) { 
      const tokens = await this.authService.login(dto);
      res.cookie('refresh', tokens.refreshToken)
      return tokens.accessToken
    }


  @ApiOperation({summary: 'Logout user'})
    @ApiResponse({status: 200})
    @Post('/logout')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    logout(@Body() _id: ObjectId) { 
      return this.authService.logout(_id);
    }

  @ApiOperation({summary: 'refresh tokens'})
    @ApiResponse({status: 200})
    @Get('/refresh/:id')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    async refresh(@Res({ passthrough: true }) res, @Req() req: any, @Param('id') id: ObjectId) {
      const refreshToken = req.cookies.refresh
      const tokens = await this.authService.refreshTokens(id, refreshToken)
      res.cookie('refresh', tokens.refreshToken)
      return tokens.accessToken
    }

  @ApiOperation({summary: 'activate user'})
    @ApiResponse({status: 200})
    @Get('/activate/:activationLink')
    async activate(@Param('activationLink') activationLink: string, @Res() res) { 
      await this.userService.activateAccount(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    }
}
