import { DataSource } from 'apollo-datasource';
import { ApolloError } from 'apollo-server';
import to from 'await-to-js';
import { MongoClient, Collection, Db, Filter, ObjectId, UpdateFilter } from 'mongodb';
import * as env from '../../../config';
import { IUser, UpdateRequest } from './models/interfaces';

export class UserDatasource extends DataSource {
  client!: MongoClient;
  collection!: Collection<IUser>;
  db!: Db;
  loc = 'UserDatasource';
  constructor(client: MongoClient) {
    super();
    this.client = client;
    this.db = this.client.db(env.database);
    this.collection = this.db.collection(env.usersCollection);
  }

  async getUser(email: string, password: string) {
    try {
      const query: Filter<IUser> = { email, password };
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(
          `An error occurred while retrieving your account. ${JSON.stringify(error)}`
        );
      } else {
        if (!!data) {
          return {
            _id: data._id,
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            isAdmin: data.isAdmin,
          } as IUser;
        }
        return undefined;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while retrieving your account. ${JSON.stringify(error)}`
      );
    }
  }

  async createUser(user: IUser) {
    try {
      const query: Filter<IUser> = { email: user.email };
      const exists = await this.collection.findOne(query);
      if (!!exists) {
        return new ApolloError(
          `This email is already registered. ${JSON.stringify({
            error: 'User already exists.',
          })}`
        );
      }
      const [error, data] = await to(
        this.collection.insertOne({
          ...user,
          createdDate: new Date().toISOString(),
          _id: new ObjectId().toString(),
        })
      );
      if (error) {
        return new ApolloError(
          `An error occurred while creating your account. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while creating your account. ${JSON.stringify(error)}`
      );
    }
  }

  async updateUser(request: UpdateRequest) {
    try {
      const query: Filter<IUser> = {
        _id: request._id,
        password: request.currentPassword,
      };
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        return new ApolloError(
          `An error occurred while trying to update your account. ${JSON.stringify(error)}`
        );
      } else {
        if (!data) {
          return new ApolloError(
            `An error occurred while retrieving your account. Please verify your password.`
          );
        }
        if (!!request.newPassword) {
          if (request.newPassword === data.password) {
            return new ApolloError(
              `Your new password cannot be the same as your current password.`
            );
          } else {
            data.password = request.newPassword;
          }
        }
        if (!!request.email) {
          if (request.email === data.email) {
            return new ApolloError(`Your new email cannot be the same as your current email.`);
          } else {
            data.email = request.email;
          }
        }
        const toUpdate: UpdateFilter<IUser> = {
          $set: {
            ...data,
            updatedDate: new Date().toISOString(),
            updated: true,
          },
        };
        return await this.collection.findOneAndUpdate(query, toUpdate);
      }
    } catch (error) {
      return new ApolloError(
        `An error occurred while trying to update your account. ${JSON.stringify(error)}`
      );
    }
  }

  async deleteUser(_id: string) {
    try {
      const query: Filter<IUser> = { _id: _id };
      const [error, data] = await to(this.collection.findOneAndDelete(query));
      if (error) {
        return new ApolloError(
          `An error occurred while trying to delete your account. ${JSON.stringify(error)}`
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
}
