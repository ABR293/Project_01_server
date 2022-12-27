import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
// import { Comment, CommentDocument } from './schemas/comment.schema';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { createUserDto } from '../dto/create-user.dto';
import { createCommentDto } from '../dto/create-comment.dto';
import { FileService, FileType } from 'src/files/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    // @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async createUser(dto: createUserDto): Promise<User> {
    return await this.userModel.create({
      ...dto,
      isActivated: false,
      avatar: '',
      status: '',
      info:{
        firstName: '',
        lastName: '',
        nikName: '',
        aboutMe: '',
        contacts: {
          email: '',
          phone: '',
        },
      },
      frends: [],
      dialogs: [],
    })
  }

  async editProfileInfo (id, data) {
    const user = await this.userModel.findById(id);
    user.info = data
    await user.save();
    return user;
  }

  async setAvatar(id, picture){
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);
    const user = await this.userModel.findById(id);
    user.avatar = picturePath
    await user.save();
    // return user;
  }

  async setStatus(id, status: string){
    const user = await this.userModel.findById(id);
    user.status = status
    await user.save();
    // return user;
  }


  async getAll(count = 10, offset = 0): Promise<User[]> {
    const users = await this.userModel
      .find()
      .skip(+offset)
      .limit(+count);
    return users;
  }

  async search(count = 10, offset = 0, query): Promise<User[]> {
    const users = await this.userModel
      .find({ name: new RegExp(query, 'i') })
      .skip(+offset)
      .limit(+count);
    return users;
  }

  async getUserByLogin(login:string): Promise<User> {
    const user = await this.userModel.findOne({login});
    return user;
  }


  async getOne(id: ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);
    return user;
  }

  async delete(id: ObjectId): Promise<ObjectId> {
    const user = await this.userModel.findByIdAndDelete(id);
    return user._id as unknown as ObjectId;
  }
}
