import { ObjectId } from 'mongoose';

export class createCommentDto {
  readonly userName: string;
  readonly text: string;
  readonly trackId: ObjectId;
  readonly likes: number;
  readonly disLikes: number;
}
