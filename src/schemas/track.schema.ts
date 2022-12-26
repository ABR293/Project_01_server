import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @ApiProperty({example: 'Du Hast', description: 'the name of track'})
  @Prop()
  name: string;

  @ApiProperty({example: 'Rammstein', description: 'the name of artist singin this track'})
  @Prop()
  artist: string;

  @ApiProperty({example: 'Du, Du Hast, Du hast mich', description: 'the text of track'})
  @Prop()
  text: string;

  @ApiProperty({example: '5', description: 'the number of listenes'})
  @Prop()
  listens: number;

  @ApiProperty({example: '', description: 'picture path on server'})
  @Prop()
  picture: string;

  @ApiProperty({example: '', description: 'audio path on server'})
  @Prop()
  audio: string;

  @ApiProperty({example: '', description: 'arrray of cooments id'})
  @Prop({ type: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }] })
  comments: mongoose.Types.ObjectId[];
}

export type TrackType = typeof Track

export const TrackSchema = SchemaFactory.createForClass(Track);
