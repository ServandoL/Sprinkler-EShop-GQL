import { GraphQLError } from 'graphql';
import { UserDatasource } from './datasource';
import { IUser, UpdateRequest } from './models/interfaces';

export const Mutation = {
  addUser: async (parent: any, args: { request: IUser }, { dataSources }: any) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      if (args.request.fname && args.request.lname && args.request.email && args.request.password) {
        const result = await client.createUser(args.request);
        if (result instanceof GraphQLError) {
          return result;
        }
        if (result && result.acknowledged && result.insertedId) {
          return {
            message: 'User created successfully.',
            success: true,
          };
        } else {
          throw new GraphQLError(`An error occurred trying to create your account.`);
        }
      } else {
        throw new GraphQLError(`All fields must be filled in.`);
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
      return await client.updateUser(args.request);
    } catch (error) {
      return error;
    }
  },
  deleteUser: async (parent: any, args: { _id: string }, { dataSources }: any) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      const result = await client.deleteUser(args._id);
      if (result && result.ok) {
        return {
          message: 'Successfully deleted your account.',
          success: true,
        };
      } else {
        return {
          message: 'Your profile could not be deleted. Please try again.',
          success: false,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
