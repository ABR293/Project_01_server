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
    UseGuards,
  } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/schemas/user.schema';
import { createUserDto } from '../dto/create-user.dto';
import { UserService } from './user.service';

  @ApiTags('Users')
  @Controller('/users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @ApiOperation({summary: 'Get all users'})
    @ApiResponse({
      status: 200, 
      description: 'Get all users',
      type: [User]})
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll(@Query('count') count: number, @Query('offset') offset: number) {
      return this.userService.getAll(count, offset);
    }
  
    @ApiOperation({summary: 'Find users with params'})
    @ApiResponse({
      status: 200,  
      description: 'Find users with params', 
      type: [User]
    })
    @Get('/search')
    search(
      @Query('count') count: number,
      @Query('offset') offset: number,
      @Query('query') query: string,
    ) {
      return this.userService.search(count, offset, query);
    }
  
    @ApiOperation({summary: 'Find one user by Id'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
      status: 200,  
      description: 'Find users with params', 
      type: User
    })
    @Get(':id')
    getOne(@Param('id') id: ObjectId) {
      return this.userService.getOne(id);
    }

    // @ApiOperation({summary: 'Add awatar to user'})
    // @ApiResponse({status: 200})
    // @Put (':id/avatar')
    // @UseInterceptors(
    //   FileFieldsInterceptor([
    //     { name: 'picture', maxCount: 1 },
    //   ])
    // )
    // setAvatar(@Param('id') id: ObjectId, @UploadedFiles() files) {
    //   const {picture} = files;
    //   return this.userService.setAvatar(id, picture);
    // }

    // @ApiOperation({summary: 'Set user status'})
    // @ApiResponse({status: 200})
    // @Put ('/status/:id')
    // @UseInterceptors(
    //   FileFieldsInterceptor([])
    // )
    // setStatus(@Param('id') id: ObjectId, @Body() data) {
    //   const {status} = data
    //   return this.userService.setStatus(id, status);
    // }

    // @ApiOperation({summary: 'set user info'})
    // @ApiResponse({
    //   status: 200, 
    //   description: 'user with new Data',
    //   type: User
    // })
    // @Put(':id')
    // @UseInterceptors(
    //   FileFieldsInterceptor([])
    // )
    // editProfileInfo(@Param('id') id: ObjectId, @Body() data) {
    //    return this.userService.editProfileInfo(id, data);
    // }
    
    @ApiOperation({summary: 'Delete user'})
    @ApiResponse({status: 200})
    @Delete(':id')
    delete(@Param('id') id: ObjectId) {
      return this.userService.delete(id);
    }
  }
  