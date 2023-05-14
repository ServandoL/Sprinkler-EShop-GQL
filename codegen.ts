import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  config: {
    useIndexSignature: true,
    contextType: '../interfaces/interfaces#AppContext',
  },
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-resolvers', 'typescript-mongodb'],
    },
  },
};

export default config;
