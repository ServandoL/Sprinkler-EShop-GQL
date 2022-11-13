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
        throw new ApolloError(
          `An error occurred while retrieving your account. ${JSON.stringify(error)}`
        );
      } else {
        if (data) {
          return {
            _id: data._id.toString(),
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            isAdmin: data.isAdmin,
          };
        }
        return undefined;
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while retrieving your account. ${JSON.stringify(error)}`
      );
    }
  }

  async createUser(user: IUser) {
    try {
      const query: Filter<IUser> = { email: user.email };
      const exists = await this.collection.findOne(query);
      if (exists) {
        throw new ApolloError(
          `This email is already registered. ${JSON.stringify({
            error: 'User already exists.',
          })}`
        );
      }
      const [error, data] = await to(
        this.collection.insertOne({
          ...user,
          createdDate: new Date().toISOString(),
          _id: new ObjectId(),
        })
      );
      if (error) {
        throw new ApolloError(
          `An error occurred while creating your account. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while creating your account. ${JSON.stringify(error)}`
      );
    }
  }

  async updateUser(request: UpdateRequest) {
    try {
      const query: Filter<IUser> = {
        _id: new ObjectId(request._id),
        password: request.currentPassword,
      };
      const [error, data] = await to(this.collection.findOne(query));
      if (error) {
        throw new ApolloError(
          `An error occurred while trying to update your account. ${JSON.stringify(error)}`
        );
      } else {
        if (!data) {
          throw new ApolloError(
            `An error occurred while retrieving your account. Please verify your password.`
          );
        }
        if (request.newPassword) {
          if (request.newPassword === data.password) {
            throw new ApolloError(`Your new password cannot be the same as your current password.`);
          } else {
            data.password = request.newPassword;
          }
        }
        if (request.email) {
          if (request.email === data.email) {
            throw new ApolloError(`Your new email cannot be the same as your current email.`);
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
        const updated = await this.collection.findOneAndUpdate(query, toUpdate);
        if (updated.ok) {
          return {
            message: 'Your profile was updated successfully.',
            success: true,
          };
        } else {
          return {
            message: 'Your profile could not be updated. Please try again.',
            success: false,
          };
        }
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while trying to update your account. ${JSON.stringify(error)}`
      );
    }
  }

  async deleteUser(_id: string) {
    try {
      const query: Filter<IUser> = { _id: new ObjectId(_id) };
      console.log(query);
      const [error, data] = await to(this.collection.findOneAndDelete(query));
      if (error) {
        throw new ApolloError(
          `An error occurred while trying to delete your account. ${JSON.stringify(error)}`
        );
      } else {
        return data;
      }
    } catch (error) {
      throw new ApolloError(
        `An error occurred while trying to delete your account. Please try again. ${JSON.stringify(
          error
        )}`
      );
    }
  }
}
