import { ApolloError } from "apollo-server";
import { createUser, deleteUser, updateUser } from "./datasource";

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
  updateUserInformation: async (parent: any, { request }: any) => {
    try {
      const result = await updateUser(request);
      if (result) {
        if (result.updated) {
          return {
            message: "Your account was updated successfully.",
            success: true,
          };
        } else {
          return new ApolloError(
            "There was an error while trying to update your account. Please try again."
          );
        }
      }
    } catch (error) {
      return error;
    }
  },
  deleteUser: async (parent: any, { _id }: any) => {
    try {
      console.log("deleteUser.mutation", _id);
      const result = await deleteUser(_id);
      if (result && result._id) {
        return {
          message: "Successfully deleted your account.",
          success: true,
        };
      } else {
        return new ApolloError(
          `There was an issue trying to process your request. Please try agian.`
        );
      }
    } catch (error) {
      return error;
    }
  },
};
