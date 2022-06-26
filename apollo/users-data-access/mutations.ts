import { ApolloError } from 'apollo-server';
import { createUser, deleteUser, updateUser } from './datasource';
import { UpdateRequest } from './models/interfaces';

export const Mutation = {
  addUser: async (parent: any, { request }: any) => {
    try {
      if (request.fname && request.lname && request.email && request.password) {
        const result = await createUser(request);
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
  updateUserInformation: async (
    parent: any,
    args: { request: UpdateRequest }
  ) => {
    try {
      const result = await updateUser(args.request);
      if (result) {
        if (result.updated) {
          return {
            message: 'Your account was updated successfully.',
            success: true,
          };
        } else {
          const error = result as ApolloError;
          return error;
        }
      }
    } catch (error) {
      return error;
    }
  },
  deleteUser: async (parent: any, { _id }: any) => {
    try {
      const result = await deleteUser(_id);
      if (result && result._id) {
        return {
          message: 'Successfully deleted your account.',
          success: true,
        };
      } else {
        return new ApolloError(
          `There was an issue trying to process your request. Please try again.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
