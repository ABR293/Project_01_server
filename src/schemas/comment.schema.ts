import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { Track } from './track.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment {

  @ApiProperty({example: 'Vasya5556', description: 'the name of comment author'})
  @Prop()
  userName: string;

  @ApiProperty({example: 'this is a wonderfull music', description: 'text of comment '})
  @Prop()
  text: string;

  @ApiProperty({example: '5', description: 'the number of likes'})
  @Prop()
  likes: number;

  @ApiProperty({example: '3', description: 'the number of dislikes'})
  @Prop()
  disLikes: number;

  // @ApiProperty({example: '', description: 'track id'})
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
  // track: Track;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
