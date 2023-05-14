import { GraphQLError } from 'graphql';
import { UserDatasource } from './datasource';

export const Query = {
  getUser: async (parent: any, args: { email: string; password: string }, { dataSources }: any) => {
    try {
      const client: UserDatasource = dataSources.userApi;
      const result = await client.getUser(args.email, args.password);
      if (result instanceof GraphQLError) {
        return result;
      }
      if (!result) {
        return {
          message: 'No user with that email or password was found.',
          success: false,
          user: null,
        };
      }
      if (result) {
        return {
          message: 'Successfully found user.',
          success: true,
          user: result,
        };
      }
      throw new GraphQLError(`An error occurred while trying to retrieve your account.`);
    } catch (error) {
      return error;
    }
  },
};
