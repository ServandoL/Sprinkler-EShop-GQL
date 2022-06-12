// import { DataSource } from "apollo-datasource";
// import { ApolloError } from "apollo-server";
// import mongoose from "mongoose";
// import {
//   ICart,
//   Order,
//   PaginatedResponse,
//   ProductRequest,
//   SaveCartRequest,
// } from "../interfaces/interfaces";

// export class MongoServer extends DataSource {
//   connection!: mongoose.Connection;

//   constructor(connection: mongoose.Connection) {
//     super();
//     this.connection = connection;
//   }

//   async getProducts(
//     request: ProductRequest
//   ): Promise<PaginatedResponse | ApolloError> {
//     try {
//       const aggregate = [
//         {
//           $match: {
//             category: request.category,
//           },
//         },
//       ];
//       const paginatedResult = await pagination(
//         this.database,
//         request.page.pageNumber,
//         request.page.pageSize,
//         aggregate
//       );
//       return paginatedResult;
//     } catch (error) {
//       return new ApolloError(
//         `An error occurred while retrieving the products. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async getAllProducts(
//     request: ProductRequest
//   ): Promise<PaginatedResponse | ApolloError> {
//     try {
//       const query = {};
//       const paginatedResult = await pagination(
//         this.database,
//         request.page.pageNumber,
//         request.page.pageSize,
//         [],
//         query
//       );
//       return paginatedResult;
//     } catch (error) {
//       return new ApolloError(
//         `An error occurred while retrieving the products. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async getCart(user_id: string) {
//     try {
//       return await this.database.findOne({ email: user_id });
//     } catch (err) {
//       return new ApolloError(
//         `An error occurred while retrieving your cart. ${JSON.stringify({
//           error: err,
//         })}`
//       );
//     }
//   }

//   async getOrders(email: string) {
//     try {
//       return await this.database.find({ email: email }).toArray();
//     } catch (error) {
//       return new ApolloError(
//         `An error occurred while retrieving your orders. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async saveCart(request: SaveCartRequest): Promise<UpdateResult | any> {
//     try {
//       return await this.database.updateOne(
//         { email: request.user_id },
//         {
//           $set: {
//             cart: [...request.cart],
//             email: request.user_id,
//             createdDate: new Date(),
//           },
//         },
//         {
//           upsert: true,
//         }
//       );
//     } catch (error: any) {
//       return new ApolloError(
//         `An error occured trying to save your cart. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async addToCart(product: ICart): Promise<UpdateResult | Document | unknown> {
//     try {
//       const existingProduct = await this.database.findOne({
//         user_id: product.user_id,
//         productName: product.productName,
//       });
//       if (existingProduct) {
//         return await this.updateCartQuantity(product);
//       }
//       return this.database.insertOne(product);
//     } catch (error) {
//       return new ApolloError(
//         `An error occured trying update your cart. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async updateCartQuantity(product: ICart) {
//     try {
//       const document = await this.database.findOne({
//         user_id: product.user_id,
//         productName: product.productName,
//       });
//       if (product.quantity > document?.stock) {
//         return "Error: Quantity cannot be greater than available stock amount.";
//       } else {
//         return await this.database.updateOne(
//           {
//             user_id: product.user_id,
//             productName: product.productName,
//           },
//           {
//             $set: {
//               quantity: product.quantity,
//             },
//           }
//         );
//       }
//     } catch (error) {
//       return new ApolloError(
//         `An error occured trying to update your cart. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async checkout(order: Order, productClient: MongoServer) {
//     try {
//       for (const product of order.order) {
//         console.log("product", product);
//         const found: WithId<Document> | null =
//           await productClient.database.findOne({
//             productName: product.productName,
//           });
//         if (found !== null) {
//           console.log("found", found);
//           await productClient.database.updateOne(
//             { _id: found._id },
//             {
//               $set: {
//                 stock: found.stock - product.quantity,
//               },
//             }
//           );
//         } else {
//           return new ApolloError(`Ooops! This product does not exist.`);
//         }
//       }
//       return await this.database.insertOne({
//         ...order,
//       });
//     } catch (error: any) {
//       return new ApolloError(
//         `An error occured while processing your order. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async clearCart(email: string) {
//     try {
//       return await this.database.deleteOne({
//         email: email,
//       });
//     } catch (error) {
//       console.log(error);
//       return new ApolloError(
//         `An error occured trying clear your cart. ${JSON.stringify({
//           error: error,
//         })}`
//       );
//     }
//   }

//   async getUserByEmail(email: string, password: string) {
//     try {
//       return await this.database.findOne({ email: email, password: password });
//     } catch (error) {
//       return new ApolloError(
//         `An error occurred fetching the user. ${JSON.stringify({ error })}`
//       );
//     }
//   }

//   async getOneById(id: any) {
//     try {
//       const query = { _id: id };
//       return await this.database.findOne(query);
//     } catch (err) {
//       return err;
//     }
//   }

//   async addOne(obj: any) {
//     let duplicateExists = null;
//     try {
//       if (obj.fname && obj.lname && obj.email && obj.password) {
//         duplicateExists = await this.database.findOne({ email: obj.email });
//         if (!duplicateExists) {
//           return await this.database.insertOne(obj);
//         }
//         return "User already exists.";
//       }
//     } catch (err) {
//       console.log(`Error occured while inserting: ${err}`);
//     }
//   }

//   async deleteOne(email: string) {
//     try {
//       const query = { email: email };
//       return await this.database.deleteOne(query);
//     } catch (err) {
//       return new ApolloError(
//         `An error occured deleting this item. ${JSON.stringify({
//           error: err,
//         })}`
//       );
//     }
//   }

//   async softDeleteOne(id: any) {
//     try {
//       const query = { _id: id };
//       const deletion = {
//         $set: {
//           isDeleted: true,
//         },
//       };
//       return await this.database.updateOne(query, deletion);
//     } catch (err) {
//       return new ApolloError(
//         `An error occured deleting this item. ${JSON.stringify({
//           error: err,
//         })}`
//       );
//     }
//   }
// }

// export async function pagination(
//   collection: Collection,
//   pageNumber: number,
//   pageSize: number,
//   aggregate: any[],
//   query?: any
// ) {
//   let count: Document[] = [];
//   let paginatedResponse = undefined;
//   const skips = pageSize * (pageNumber - 1);

//   if (query !== undefined) {
//     count = await collection.find(query).toArray();
//     paginatedResponse = await collection
//       .find(query)
//       .skip(skips)
//       .limit(pageSize)
//       .toArray();
//   } else {
//     count = await collection.aggregate(aggregate).toArray();
//     paginatedResponse = await collection
//       .aggregate(aggregate)
//       .skip(skips)
//       .limit(pageSize)
//       .toArray();
//   }
//   const totalElements = count ? count.length : 0;
//   const totalPages = Math.ceil(totalElements / pageSize);
//   const lastPage = pageNumber === totalPages;
//   return {
//     data: [...paginatedResponse],
//     pagination: {
//       pageNumber: pageNumber,
//       pageSize: pageSize,
//       totalElements: totalElements,
//       totalPages: totalPages,
//       lastPage: lastPage,
//       firstPage: pageNumber === 1,
//       currentPage: pageNumber,
//     },
//   } as PaginatedResponse;
// }
