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
    registration(@Body() dto: createUserDto) { 
      console.log(dto)
       return this.authService.registration(dto);
    }

  @ApiOperation({summary: 'Login user'})
    @ApiResponse({status: 200})
    @Post('/login')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    login(@Body() dto: createUserDto) { 
      console.log(dto)
       return this.authService.login(dto);
    }

  @ApiOperation({summary: 'Logout user'})
    @ApiResponse({status: 200})
    @Post('/login')
    @UseInterceptors(
      FileFieldsInterceptor([])
    )
    logout(@Body() dto: createUserDto) { 
      console.log(dto)
       return this.authService.login(dto);
    }

  @ApiOperation({summary: 'activate user'})
    @ApiResponse({status: 200})
    @Get('/activate/:activationLink')
    async activate(@Param('activationLink') activationLink: string, @Res() res) { 
      await this.userService.activateAccount(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    }
}
