import { GraphQLResolveInfo } from 'graphql';
import { AppContext } from '../interfaces/interfaces';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AddProductRequest = {
  brand: Scalars['String'];
  category: Scalars['String'];
  createdBy: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
  productName: Scalars['String'];
  stock: Scalars['Int'];
};

export type AddToCartInput = {
  _id?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  productName?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  stock?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type AddUserInput = {
  email?: InputMaybe<Scalars['String']>;
  fname?: InputMaybe<Scalars['String']>;
  isAdmin?: InputMaybe<Scalars['Boolean']>;
  lname?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};

export type Cart = {
  __typename?: 'Cart';
  _id?: Maybe<Scalars['ID']>;
  brand?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  productName?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  stock?: Maybe<Scalars['Int']>;
};

export type CartInput = {
  _id?: InputMaybe<Scalars['String']>;
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  productName?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
  stock?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type DeleteProductItem = {
  _id: Scalars['ID'];
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  productName?: InputMaybe<Scalars['String']>;
  stock?: InputMaybe<Scalars['Int']>;
};

export type DeleteRequest = {
  email?: InputMaybe<Scalars['String']>;
  product?: InputMaybe<DeleteProductItem>;
};

export type FilterInput = {
  filters?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type FindProductInput = {
  brand?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  categories?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  page: Page;
  priceRange?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  rating?: InputMaybe<Scalars['Int']>;
  search?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addProduct?: Maybe<AddProductResponse>;
  addToCart?: Maybe<GenericResponse>;
  addUser?: Maybe<GenericResponse>;
  clearCart?: Maybe<GenericResponse>;
  createOrder?: Maybe<GenericResponse>;
  deleteProduct?: Maybe<DeleteProductResponse>;
  deleteUser?: Maybe<GenericResponse>;
  reviewProduct?: Maybe<ReviewProductResponse>;
  saveCart?: Maybe<GenericResponse>;
  updateCart?: Maybe<GenericResponse>;
  updateProduct?: Maybe<GenericResponse>;
  updateUserInformation?: Maybe<GenericResponse>;
};


export type MutationAddProductArgs = {
  addProductRequest?: InputMaybe<AddProductRequest>;
};


export type MutationAddToCartArgs = {
  request?: InputMaybe<AddToCartInput>;
};


export type MutationAddUserArgs = {
  request?: InputMaybe<AddUserInput>;
};


export type MutationClearCartArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type MutationCreateOrderArgs = {
  request?: InputMaybe<OrderInput>;
};


export type MutationDeleteProductArgs = {
  deleteRequest?: InputMaybe<DeleteRequest>;
};


export type MutationDeleteUserArgs = {
  _id?: InputMaybe<Scalars['String']>;
};


export type MutationReviewProductArgs = {
  reviewRequest?: InputMaybe<ReviewRequest>;
};


export type MutationSaveCartArgs = {
  request?: InputMaybe<SaveCartRequest>;
};


export type MutationUpdateCartArgs = {
  request?: InputMaybe<CartInput>;
};


export type MutationUpdateProductArgs = {
  updateRequest?: InputMaybe<UpdateProductRequest>;
};


export type MutationUpdateUserInformationArgs = {
  request?: InputMaybe<UpdateUserInput>;
};

export type OrderHistoryRequest = {
  page?: InputMaybe<Page>;
  userId?: InputMaybe<Scalars['String']>;
};

export type OrderInput = {
  email?: InputMaybe<Scalars['String']>;
  order?: InputMaybe<Array<InputMaybe<CartInput>>>;
  payment?: InputMaybe<PaymentInput>;
  shipping?: InputMaybe<ShippingInput>;
  total?: InputMaybe<Scalars['Float']>;
  userId?: InputMaybe<Scalars['String']>;
};

export type OrderType = {
  __typename?: 'OrderType';
  _id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  order?: Maybe<Array<Maybe<Cart>>>;
  orderId?: Maybe<Scalars['String']>;
  orderedDate?: Maybe<Scalars['String']>;
  payment?: Maybe<PaymentType>;
  shipping?: Maybe<ShippingType>;
  total?: Maybe<Scalars['Float']>;
};

export type Page = {
  pageNumber: Scalars['Int'];
  pageSize: Scalars['Int'];
};

export type Pagination = {
  __typename?: 'Pagination';
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPrevPage?: Maybe<Scalars['Boolean']>;
  limit?: Maybe<Scalars['Int']>;
  nextPage?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
  pagingCounter?: Maybe<Scalars['Int']>;
  prevPage?: Maybe<Scalars['Int']>;
  totalDocs?: Maybe<Scalars['Int']>;
  totalPages?: Maybe<Scalars['Int']>;
};

export type PaymentInput = {
  cardNumber?: InputMaybe<Scalars['String']>;
  cvv?: InputMaybe<Scalars['String']>;
  month?: InputMaybe<Scalars['String']>;
  year?: InputMaybe<Scalars['String']>;
};

export type PaymentType = {
  __typename?: 'PaymentType';
  cardNumber?: Maybe<Scalars['String']>;
  cvv?: Maybe<Scalars['String']>;
  month?: Maybe<Scalars['String']>;
  year?: Maybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  _id?: Maybe<Scalars['ID']>;
  brand: Scalars['String'];
  category: Scalars['String'];
  deleted_by?: Maybe<Scalars['String']>;
  deleted_date?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  isDeleted?: Maybe<Scalars['Boolean']>;
  price: Scalars['Float'];
  productName: Scalars['String'];
  rating?: Maybe<Scalars['Float']>;
  ratings?: Maybe<Array<Maybe<Rating>>>;
  stock: Scalars['Int'];
};

export type ProductInput = {
  brand?: InputMaybe<Scalars['String']>;
  category?: InputMaybe<Scalars['String']>;
  deleted_by?: InputMaybe<Scalars['String']>;
  deleted_date?: InputMaybe<Scalars['String']>;
  isDeleted?: InputMaybe<Scalars['Boolean']>;
  page: Page;
  price?: InputMaybe<Scalars['Float']>;
  productName?: InputMaybe<Scalars['String']>;
  stock?: InputMaybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  allProducts?: Maybe<GetProductResponse>;
  findProducts?: Maybe<GetProductResponse>;
  getCart?: Maybe<GetCartResponse>;
  getCurrentProduct?: Maybe<GetCurrentProductResponse>;
  getFilters?: Maybe<GetFilterResponse>;
  getUser?: Maybe<GetUserResponse>;
  orders?: Maybe<GetOrderResponse>;
  products?: Maybe<GetProductResponse>;
};


export type QueryAllProductsArgs = {
  productRequest?: InputMaybe<ProductInput>;
};


export type QueryFindProductsArgs = {
  filterRequest?: InputMaybe<FindProductInput>;
};


export type QueryGetCartArgs = {
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryGetCurrentProductArgs = {
  productId: Scalars['String'];
};


export type QueryGetFiltersArgs = {
  filterRequest?: InputMaybe<FilterInput>;
};


export type QueryGetUserArgs = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  orderHistoryRequest?: InputMaybe<OrderHistoryRequest>;
};


export type QueryProductsArgs = {
  productRequest?: InputMaybe<ProductInput>;
};

export type Rating = {
  __typename?: 'Rating';
  createdDate?: Maybe<Scalars['String']>;
  headLine?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  rate?: Maybe<Scalars['Int']>;
  review?: Maybe<Scalars['String']>;
};

export type ReviewProductResponse = {
  __typename?: 'ReviewProductResponse';
  message?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  success?: Maybe<Scalars['Boolean']>;
};

export type ReviewRequest = {
  createdDate?: InputMaybe<Scalars['String']>;
  headLine?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  productId: Scalars['ID'];
  rate?: InputMaybe<Scalars['Int']>;
  review?: InputMaybe<Scalars['String']>;
};

export type SaveCartRequest = {
  cart?: InputMaybe<Array<InputMaybe<CartInput>>>;
  userId?: InputMaybe<Scalars['String']>;
};

export type ShippingInput = {
  address?: InputMaybe<Scalars['String']>;
  address2?: InputMaybe<Scalars['String']>;
  city?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  zipCode?: InputMaybe<Scalars['String']>;
};

export type ShippingType = {
  __typename?: 'ShippingType';
  address?: Maybe<Scalars['String']>;
  address2?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  zipCode?: Maybe<Scalars['String']>;
};

export type UpdateCartQuantity = {
  _id?: InputMaybe<Scalars['ID']>;
  email?: InputMaybe<Scalars['String']>;
  quantity?: InputMaybe<Scalars['Int']>;
};

export type UpdateProductRequest = {
  imageUrl?: InputMaybe<Scalars['String']>;
  modifiedBy?: InputMaybe<Scalars['String']>;
  modifiedDate?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['Float']>;
  productId?: InputMaybe<Scalars['ID']>;
  productName?: InputMaybe<Scalars['String']>;
  stock?: InputMaybe<Scalars['Int']>;
};

export type UpdateUserInput = {
  _id: Scalars['String'];
  currentPassword: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  newPassword?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  _id?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  fname?: Maybe<Scalars['String']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  lname?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type AddProductResponse = {
  __typename?: 'addProductResponse';
  message?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type DeleteProductResponse = {
  __typename?: 'deleteProductResponse';
  message?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type GenericResponse = {
  __typename?: 'genericResponse';
  message?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
};

export type GetCartResponse = {
  __typename?: 'getCartResponse';
  cart?: Maybe<Array<Maybe<Cart>>>;
  email?: Maybe<Scalars['String']>;
};

export type GetCurrentProductResponse = {
  __typename?: 'getCurrentProductResponse';
  product?: Maybe<Product>;
};

export type GetFilterResponse = {
  __typename?: 'getFilterResponse';
  brands?: Maybe<Array<Maybe<Scalars['String']>>>;
  categories?: Maybe<Array<Maybe<Scalars['String']>>>;
  success?: Maybe<Scalars['Boolean']>;
};

export type GetOrderResponse = {
  __typename?: 'getOrderResponse';
  data?: Maybe<Array<Maybe<OrderType>>>;
  pagination?: Maybe<Pagination>;
};

export type GetProductResponse = {
  __typename?: 'getProductResponse';
  data?: Maybe<Array<Maybe<Product>>>;
  pagination?: Maybe<Pagination>;
};

export type GetUserResponse = {
  __typename?: 'getUserResponse';
  message?: Maybe<Scalars['String']>;
  success?: Maybe<Scalars['Boolean']>;
  user?: Maybe<User>;
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['String']>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddProductRequest: AddProductRequest;
  String: ResolverTypeWrapper<Scalars['String']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  AddToCartInput: AddToCartInput;
  AddUserInput: AddUserInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Cart: ResolverTypeWrapper<Cart>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  CartInput: CartInput;
  DeleteProductItem: DeleteProductItem;
  DeleteRequest: DeleteRequest;
  FilterInput: FilterInput;
  FindProductInput: FindProductInput;
  Mutation: ResolverTypeWrapper<{}>;
  OrderHistoryRequest: OrderHistoryRequest;
  OrderInput: OrderInput;
  OrderType: ResolverTypeWrapper<OrderType>;
  Page: Page;
  Pagination: ResolverTypeWrapper<Pagination>;
  PaymentInput: PaymentInput;
  PaymentType: ResolverTypeWrapper<PaymentType>;
  Product: ResolverTypeWrapper<Product>;
  ProductInput: ProductInput;
  Query: ResolverTypeWrapper<{}>;
  Rating: ResolverTypeWrapper<Rating>;
  ReviewProductResponse: ResolverTypeWrapper<ReviewProductResponse>;
  ReviewRequest: ReviewRequest;
  SaveCartRequest: SaveCartRequest;
  ShippingInput: ShippingInput;
  ShippingType: ResolverTypeWrapper<ShippingType>;
  UpdateCartQuantity: UpdateCartQuantity;
  UpdateProductRequest: UpdateProductRequest;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  addProductResponse: ResolverTypeWrapper<AddProductResponse>;
  deleteProductResponse: ResolverTypeWrapper<DeleteProductResponse>;
  genericResponse: ResolverTypeWrapper<GenericResponse>;
  getCartResponse: ResolverTypeWrapper<GetCartResponse>;
  getCurrentProductResponse: ResolverTypeWrapper<GetCurrentProductResponse>;
  getFilterResponse: ResolverTypeWrapper<GetFilterResponse>;
  getOrderResponse: ResolverTypeWrapper<GetOrderResponse>;
  getProductResponse: ResolverTypeWrapper<GetProductResponse>;
  getUserResponse: ResolverTypeWrapper<GetUserResponse>;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddProductRequest: AddProductRequest;
  String: Scalars['String'];
  Float: Scalars['Float'];
  Int: Scalars['Int'];
  AddToCartInput: AddToCartInput;
  AddUserInput: AddUserInput;
  Boolean: Scalars['Boolean'];
  Cart: Cart;
  ID: Scalars['ID'];
  CartInput: CartInput;
  DeleteProductItem: DeleteProductItem;
  DeleteRequest: DeleteRequest;
  FilterInput: FilterInput;
  FindProductInput: FindProductInput;
  Mutation: {};
  OrderHistoryRequest: OrderHistoryRequest;
  OrderInput: OrderInput;
  OrderType: OrderType;
  Page: Page;
  Pagination: Pagination;
  PaymentInput: PaymentInput;
  PaymentType: PaymentType;
  Product: Product;
  ProductInput: ProductInput;
  Query: {};
  Rating: Rating;
  ReviewProductResponse: ReviewProductResponse;
  ReviewRequest: ReviewRequest;
  SaveCartRequest: SaveCartRequest;
  ShippingInput: ShippingInput;
  ShippingType: ShippingType;
  UpdateCartQuantity: UpdateCartQuantity;
  UpdateProductRequest: UpdateProductRequest;
  UpdateUserInput: UpdateUserInput;
  User: User;
  addProductResponse: AddProductResponse;
  deleteProductResponse: DeleteProductResponse;
  genericResponse: GenericResponse;
  getCartResponse: GetCartResponse;
  getCurrentProductResponse: GetCurrentProductResponse;
  getFilterResponse: GetFilterResponse;
  getOrderResponse: GetOrderResponse;
  getProductResponse: GetProductResponse;
  getUserResponse: GetUserResponse;
  AdditionalEntityFields: AdditionalEntityFields;
}>;

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = AppContext, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = AppContext, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = AppContext, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = AppContext, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = AppContext, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = AppContext, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = AppContext, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = AppContext, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CartResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  brand?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  productName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stock?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addProduct?: Resolver<Maybe<ResolversTypes['addProductResponse']>, ParentType, ContextType, Partial<MutationAddProductArgs>>;
  addToCart?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationAddToCartArgs>>;
  addUser?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationAddUserArgs>>;
  clearCart?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationClearCartArgs>>;
  createOrder?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationCreateOrderArgs>>;
  deleteProduct?: Resolver<Maybe<ResolversTypes['deleteProductResponse']>, ParentType, ContextType, Partial<MutationDeleteProductArgs>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationDeleteUserArgs>>;
  reviewProduct?: Resolver<Maybe<ResolversTypes['ReviewProductResponse']>, ParentType, ContextType, Partial<MutationReviewProductArgs>>;
  saveCart?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationSaveCartArgs>>;
  updateCart?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationUpdateCartArgs>>;
  updateProduct?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationUpdateProductArgs>>;
  updateUserInformation?: Resolver<Maybe<ResolversTypes['genericResponse']>, ParentType, ContextType, Partial<MutationUpdateUserInformationArgs>>;
}>;

export type OrderTypeResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['OrderType'] = ResolversParentTypes['OrderType']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<Maybe<Array<Maybe<ResolversTypes['Cart']>>>, ParentType, ContextType>;
  orderId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderedDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  payment?: Resolver<Maybe<ResolversTypes['PaymentType']>, ParentType, ContextType>;
  shipping?: Resolver<Maybe<ResolversTypes['ShippingType']>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaginationResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']> = ResolversObject<{
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPrevPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  limit?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  nextPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  offset?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pagingCounter?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  prevPage?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalDocs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  totalPages?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PaymentTypeResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['PaymentType'] = ResolversParentTypes['PaymentType']> = ResolversObject<{
  cardNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  cvv?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  month?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  brand?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deleted_by?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deleted_date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isDeleted?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  ratings?: Resolver<Maybe<Array<Maybe<ResolversTypes['Rating']>>>, ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allProducts?: Resolver<Maybe<ResolversTypes['getProductResponse']>, ParentType, ContextType, Partial<QueryAllProductsArgs>>;
  findProducts?: Resolver<Maybe<ResolversTypes['getProductResponse']>, ParentType, ContextType, Partial<QueryFindProductsArgs>>;
  getCart?: Resolver<Maybe<ResolversTypes['getCartResponse']>, ParentType, ContextType, Partial<QueryGetCartArgs>>;
  getCurrentProduct?: Resolver<Maybe<ResolversTypes['getCurrentProductResponse']>, ParentType, ContextType, RequireFields<QueryGetCurrentProductArgs, 'productId'>>;
  getFilters?: Resolver<Maybe<ResolversTypes['getFilterResponse']>, ParentType, ContextType, Partial<QueryGetFiltersArgs>>;
  getUser?: Resolver<Maybe<ResolversTypes['getUserResponse']>, ParentType, ContextType, Partial<QueryGetUserArgs>>;
  orders?: Resolver<Maybe<ResolversTypes['getOrderResponse']>, ParentType, ContextType, Partial<QueryOrdersArgs>>;
  products?: Resolver<Maybe<ResolversTypes['getProductResponse']>, ParentType, ContextType, Partial<QueryProductsArgs>>;
}>;

export type RatingResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['Rating'] = ResolversParentTypes['Rating']> = ResolversObject<{
  createdDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  headLine?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  rate?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  review?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ReviewProductResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['ReviewProductResponse'] = ResolversParentTypes['ReviewProductResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ShippingTypeResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['ShippingType'] = ResolversParentTypes['ShippingType']> = ResolversObject<{
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  _id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAdmin?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  password?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AddProductResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['addProductResponse'] = ResolversParentTypes['addProductResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteProductResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['deleteProductResponse'] = ResolversParentTypes['deleteProductResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GenericResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['genericResponse'] = ResolversParentTypes['genericResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetCartResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getCartResponse'] = ResolversParentTypes['getCartResponse']> = ResolversObject<{
  cart?: Resolver<Maybe<Array<Maybe<ResolversTypes['Cart']>>>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetCurrentProductResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getCurrentProductResponse'] = ResolversParentTypes['getCurrentProductResponse']> = ResolversObject<{
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetFilterResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getFilterResponse'] = ResolversParentTypes['getFilterResponse']> = ResolversObject<{
  brands?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  categories?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetOrderResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getOrderResponse'] = ResolversParentTypes['getOrderResponse']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrderType']>>>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetProductResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getProductResponse'] = ResolversParentTypes['getProductResponse']> = ResolversObject<{
  data?: Resolver<Maybe<Array<Maybe<ResolversTypes['Product']>>>, ParentType, ContextType>;
  pagination?: Resolver<Maybe<ResolversTypes['Pagination']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type GetUserResponseResolvers<ContextType = AppContext, ParentType extends ResolversParentTypes['getUserResponse'] = ResolversParentTypes['getUserResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = AppContext> = ResolversObject<{
  Cart?: CartResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OrderType?: OrderTypeResolvers<ContextType>;
  Pagination?: PaginationResolvers<ContextType>;
  PaymentType?: PaymentTypeResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rating?: RatingResolvers<ContextType>;
  ReviewProductResponse?: ReviewProductResponseResolvers<ContextType>;
  ShippingType?: ShippingTypeResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  addProductResponse?: AddProductResponseResolvers<ContextType>;
  deleteProductResponse?: DeleteProductResponseResolvers<ContextType>;
  genericResponse?: GenericResponseResolvers<ContextType>;
  getCartResponse?: GetCartResponseResolvers<ContextType>;
  getCurrentProductResponse?: GetCurrentProductResponseResolvers<ContextType>;
  getFilterResponse?: GetFilterResponseResolvers<ContextType>;
  getOrderResponse?: GetOrderResponseResolvers<ContextType>;
  getProductResponse?: GetProductResponseResolvers<ContextType>;
  getUserResponse?: GetUserResponseResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = AppContext> = ResolversObject<{
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
}>;

import { ObjectId } from 'mongodb';