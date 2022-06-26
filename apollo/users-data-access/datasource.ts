import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { IUser, UpdateRequest } from './models/interfaces';
import * as env from '../../config';
import { UserSchema } from './models/users.schema';

const UserModel: mongoose.Model<IUser> = mongoose.model<IUser>(
  env.usersCollection,
  UserSchema
);

export async function getUser(email: string, password: string) {
  try {
    const query: FilterQuery<IUser> = { email: email, password: password };
    const [error, data] = await to(UserModel.findOne(query).exec());
    if (error) {
      return new ApolloError(
        `An error occurred while retrieving the products. ${JSON.stringify(
          error
        )}`
      );
    } else {
      if (data?._id) {
        return {
          _id: data._id,
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          isAdmin: data.isAdmin,
        } as IUser;
      } else {
        return null;
      }
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while retrieving your account. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function createUser(user: IUser) {
  try {
    const query: FilterQuery<IUser> = { email: user.email };
    const exists = await UserModel.findOne(query).exec();
    if (exists?._id) {
      return new ApolloError(
        `This email is already registered. ${JSON.stringify({
          error: 'User already exists.',
        })}`
      );
    } else {
      const [error, data] = await to(
        UserModel.create({
          ...user,
          createdDate: new Date().toISOString(),
          _id: new mongoose.mongo.ObjectId(),
        })
      );
      if (error) {
        return new ApolloError(
          `An error occurred while creating your account. ${JSON.stringify(
            error
          )}`
        );
      } else {
        return {
          message: 'Successfully created your account. You may now log in.',
          success: true,
        };
      }
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while creating your account. ${JSON.stringify(error)}`
    );
  }
}

export async function updateUser(request: UpdateRequest) {
  try {
    const query: FilterQuery<IUser> = {
      _id: request._id,
      password: request.currentPassword,
    };
    const result = await UserModel.findOne(query).exec();
    const user = result?.toObject() as IUser;
    if (user && user._id) {
      if (request.newPassword) {
        if (request.newPassword === user.password) {
          return new ApolloError(
            `ERROR: Your new password can't be the same as your current password.`
          );
        } else {
          user.password = request.newPassword;
        }
      }
      if (request.email) {
        if (request.email === user.email) {
          return new ApolloError(
            `ERROR: Your new email can't be the same as your current email.`
          );
        } else {
          user.email = request.email;
        }
      }
      const update: UpdateQuery<IUser> = {
        ...user,
        updatedDate: new Date().toISOString(),
        updated: true,
      };
      return await UserModel.findOneAndUpdate(query, update, {
        returnDocument: 'after',
      }).exec();
    } else {
      return new ApolloError(
        `ERROR: You entered the wrong password. Please verify your current password.`
      );
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to update your account. ${JSON.stringify(
        error
      )}`
    );
  }
}

export async function deleteUser(userId: string) {
  try {
    const query: FilterQuery<IUser> = { _id: userId };
    const [error, data] = await to(UserModel.findOneAndDelete(query).exec());
    if (error) {
      return new ApolloError(
        `An error occurred while trying to delete your account. Please try agian.`
      );
    } else {
      return data;
    }
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to delete your account. Please try again. ${JSON.stringify(
        error
      )}`
    );
  }
}
