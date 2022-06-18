import { getUser } from './datasource';

export const Query = {
  getUser: async (parent: any, { email, password }: any) => {
    try {
      const result = await getUser(email, password);
      if (result === null) {
        return {
          message: 'No user with that email or password was found.',
          success: false,
          user: null,
        };
      }
      if (result?._id) {
        return {
          message: 'Successfully found user.',
          success: true,
          user: result,
        };
      } else {
        return {
          message: 'INTERNAL_SERVER_ERROR',
          success: false,
          user: result,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
