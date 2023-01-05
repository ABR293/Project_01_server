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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose, { ObjectId } from 'mongoose';
import { Track } from 'src/schemas/track.schema';
import { Comment } from 'src/schemas/comment.schema';
import { createCommentDto } from '../dto/create-comment.dto';
import { createTrackDto } from '../dto/create-track.dto';
import { TrackService } from './track.service';

@ApiTags('Tracks')
@Controller('/tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @ApiOperation({ summary: 'Create new track' })
  @ApiResponse({
    status: 200,
    description: 'new track',
    type: Track,
  })
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )
  create(@UploadedFiles() files, @Body() dto: createTrackDto) {
    const { picture, audio } = files;
    console.log('dtoT', dto);
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @ApiOperation({ summary: 'Edit track information' })
  @ApiResponse({
    status: 200,
    description: 'edit end return new track',
    type: Track,
  })
  @Put(':id')
  update(@Param('id') id: ObjectId, @Body() dto: createTrackDto) {
    return this.trackService.update(id, dto);
  }

  @ApiOperation({ summary: 'Get all tracks' })
  @ApiResponse({
    status: 200,
    description: 'return all tracks',
    type: [Track],
  })
  @Get()
  getAll(@Query('count') count: number, @Query('offset') offset: number) {
    return this.trackService.getAll(count, offset);
  }

  @ApiOperation({ summary: 'Get tracks that you want to find' })
  @ApiResponse({
    status: 200,
    description: 'find and return tracks with params',
    type: [Track],
  })
  @Get('/search')
  search(
    @Query('count') count: number,
    @Query('offset') offset: number,
    @Query('query') query: string,
  ) {
    return this.trackService.search(count, offset, query);
  }

  @ApiOperation({ summary: 'Get one track' })
  @ApiResponse({
    status: 200,
    description: 'find and return one track',
    type: Track,
  })
  @Get(':id')
  getOne(@Param('id') id: ObjectId) {
    return this.trackService.getOne(id);
  }

  @ApiOperation({ summary: 'Delete  track' })
  @ApiResponse({
    status: 200,
    description: 'return id of deleted track',
    type: mongoose.Types.ObjectId,
  })
  @Delete(':id')
  delete(@Param('id') id: ObjectId) {
    return this.trackService.delete(id);
  }

  @ApiOperation({ summary: 'add comment to track' })
  @ApiResponse({ status: 200, type: Comment })
  @Post('/comment')
  addComment(@Body() dto: createCommentDto) {
    return this.trackService.addComment(dto);
  }

  @ApiOperation({ summary: 'add 1 listen to track' })
  @ApiResponse({
    status: 200,
    description: 'add one lissten to track',
  })
  @Post('/listen/:id')
  listen(@Param('id') id: ObjectId) {
    return this.trackService.listen(id);
  }
}
