import { IProduct, IUser } from "../../../interfaces/interfaces";

export const Mutation = {
  addProduct: async (
    parent: any,
    args: IProduct,
    { dataSources }: any,
    info: any
  ) => {
    const client = dataSources.productsApi;
    try {
      await client.start();
      const result =  await client.addOne(args);
      if (!result.acknowledged) {
        return result.errors;
      }
      return {
        ...args,
        message: `Product inserted successfully.\nID: ${result.insertedId}`
      }
    } catch(err) {
      console.error(`Error inserting a new document.\n${err}`);
      return {
        code: 'ERROR',
        message: `Error occurred creating a new document.\n${err}`
      };
    } finally {
      client.stop();
    }

  },
  // addUser: (parent: any, args: IUser, context: any, info: any) => {
  //   const { fname, lname, email, isAdmin } = args;
  //   const user = new User({
  //     fname,
  //     lname,
  //     email,
  //     isAdmin,
  //   });
  //   return user
  //     .save()
  //     .then((result) => {
  //       return { ...result };
  //     })
  //     .catch((err: any) => {
  //       console.error(err);
  //     });
  // },
};
