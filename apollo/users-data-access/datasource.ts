import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import mongoose, { FilterQuery, UpdateQuery } from 'mongoose';
import { IUser, UpdateRequest } from './models/interfaces';

export async function getUser(
  email: string,
  password: string,
  model: mongoose.Model<IUser>
) {
  try {
    const query: FilterQuery<IUser> = { email: email, password: password };
    const [error, data] = await to(model.findOne(query).exec());
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

export async function createUser(user: IUser, model: mongoose.Model<IUser>) {
  try {
    const query: FilterQuery<IUser> = { email: user.email };
    const exists = await model.findOne(query).exec();
    if (exists?._id) {
      return new ApolloError(
        `This email is already registered. ${JSON.stringify({
          error: 'User already exists.',
        })}`
      );
    } else {
      const [error, data] = await to(
        model.create({
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

export async function updateUser(
  request: UpdateRequest,
  model: mongoose.Model<IUser>
) {
  try {
    const query: FilterQuery<IUser> = { email: request.email };
    const update: UpdateQuery<IUser> = {
      ...request,
      updatedDate: new Date().toISOString(),
      updated: true,
    };
    return model.findOneAndUpdate(query, update, { returnDocument: 'after' });
  } catch (error) {
    return new ApolloError(
      `An error occurred while trying to update your account. ${JSON.stringify(
        error
      )}`
    );
  }
}
