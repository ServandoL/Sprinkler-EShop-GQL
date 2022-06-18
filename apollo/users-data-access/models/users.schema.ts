import { Schema } from 'mongoose';
import { IUser } from './interfaces';
import * as env from '../../../config';
const userColn = env.usersCollection;

export const UserSchema = new Schema<IUser>(
  {
    _id: String,
    fname: String,
    lname: String,
    password: String,
    email: String,
    isAdmin: Boolean,
    createdDate: String,
    updatedDate: String,
    updated: Boolean,
  },
  {
    collection: userColn,
  }
);
