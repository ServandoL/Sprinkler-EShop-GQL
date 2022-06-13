import mongoose, { FilterQuery } from 'mongoose';
import { IUser } from './models/interfaces';
import * as env from '../../config';
import { UserSchema } from './models/users.schema';
import { getUser } from './datasource';

const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>(
  env.usersCollection,
  UserSchema
);

export const Query = {
  getUser: async (parent: any, { email, password }: any) => {
    try {
      const result = await getUser(email, password, UserModel);
      if (result === null) {
        return {
          message: 'No user with that email or password was found.',
          success: false,
          user: null,
        };
      }
      if (result?._id) {
        return {
          message: 'Successfully found user.',
          success: true,
          user: result,
        };
      } else {
        return {
          message: 'INTERNAL_SERVER_ERROR',
          success: false,
          user: result,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
