export const Query = {
  products: (parent: any, args: any, { dataSources }: any, info: any) => {
    return dataSources.productsApi.getProducts(args);
  },
  productById: (parent: any, { id }: any, { dataSources }: any, info: any) => {
    return dataSources.productsApi.getProductById(id);
  },
  users: (parent: any, args: any, { dataSources }: any, info: any) => {
    return dataSources.usersApi.getUsers(args);
  },
  userById: (parent: any, { id }: any, { dataSources }: any, info: any) => {
    return dataSources.usersApi.getUserById(id);
  },
};
