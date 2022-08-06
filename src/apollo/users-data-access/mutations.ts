import { ApolloError } from 'apollo-server';
import { UserDatasource } from './datasource';
import { IUser, UpdateRequest } from './models/interfaces';

export const Mutation = {
  addUser: async (parent: any, args: { request: IUser }, { dataSources }: any) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      if (args.request.fname && args.request.lname && args.request.email && args.request.password) {
        const result = await client.createUser(args.request);
        if (result instanceof ApolloError) {
          return result;
        }
        if (result && result.acknowledged && result.insertedId) {
          return {
            message: 'User created successfully.',
            success: true,
          };
        } else {
          return new ApolloError(`An error occurred trying to create your account.`);
        }
      } else {
        return new ApolloError(`All fields must be filled in.`);
      }
    } catch (error) {
      return error;
    }
  },
  updateUserInformation: async (
    parent: any,
    args: { request: UpdateRequest },
    { dataSources }: any
  ) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      const result = await client.updateUser(args.request);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result && result.ok) {
        if (result.value?.updated) {
          return {
            message: 'Your account was updated successfully.',
            success: true,
          };
        }
        return new ApolloError(
          `An error occurred while trying to update your account. Please try again.`
        );
      }
      return new ApolloError(
        `An error occurred while trying to update your account. Please try again.`
      );
    } catch (error) {
      return error;
    }
  },
  deleteUser: async (parent: any, args: { request: string }, { dataSources }: any) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      const result = await client.deleteUser(args.request);
      if (result instanceof ApolloError) {
        return result;
      }
      if (result && result.ok) {
        return {
          message: 'Successfully deleted your account.',
          success: true,
        };
      }
      return new ApolloError(`An error occurred while trying to delete your account.`);
    } catch (error) {
      return error;
    }
  },
};
