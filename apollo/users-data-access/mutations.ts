import { ApolloError } from 'apollo-server';
import mongoose from 'mongoose';
import { IUser } from './models/interfaces';
import { UserSchema } from './models/users.schema';
import * as env from '../../config';
import { createUser, updateUser } from './datasource';

const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>(
  env.usersCollection,
  UserSchema
);
export const Mutation = {
  addUser: async (parent: any, { request }: any) => {
    try {
      if (request.fname && request.lname && request.email && request.password) {
        const result = await createUser(request, UserModel);
        if (result.message !== undefined || result.message !== null) {
          if (result.success) {
            return result;
          } else {
            return result;
          }
        } else {
          return result;
        }
      } else {
        return new ApolloError(`All fields must be filled in.`);
      }
    } catch (error) {
      return error;
    }
  },
  updateUserInformation: async (parent: any, { request }: any) => {
    try {
      const result = await updateUser(request, UserModel);
      if (result) {
        if (result.updated) {
          return {
            message: 'Your account was updated successfully.',
            success: true,
          };
        } else {
          return new ApolloError(
            'There was an error while trying to update your account. Please try again.'
          );
        }
      }
    } catch (error) {
      return error;
    }
  },
};
