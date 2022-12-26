import { ObjectId } from 'mongoose';
import { ApiProperty } from "@nestjs/swagger";


export class createCommentDto {
  @ApiProperty({example: 'Peter', description: 'name of user-owner of comment'})
  readonly userName: string;

  @ApiProperty({example: 'its wonderfull musick it makes me happy', description: 'text of comment message'})
  readonly text: string;

  @ApiProperty({example: '', description: '_id of Track'})
  readonly trackId: ObjectId;

  @ApiProperty({example: '5', description: 'count of likes'})
  readonly likes: number;

  @ApiProperty({example: '3', description: 'count of dislikes'})
  readonly disLikes: number;
}
