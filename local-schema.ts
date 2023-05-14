import type { CodegenConfig } from '@graphql-codegen/cli';
import { ProductsTypeDef } from './src/apollo/products-data-access/schema';
import { OrderTypeDefs } from './src/apollo/order-data-access/schema';
import { CartTypeDefs } from './src/apollo/cart-data-access/schema';
import { UserTypeDefs } from './src/apollo/users-data-access/schema';
const config: CodegenConfig = {
  overwrite: true,
  schema: [ProductsTypeDef, OrderTypeDefs, CartTypeDefs, UserTypeDefs],
  generates: {
    'schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
