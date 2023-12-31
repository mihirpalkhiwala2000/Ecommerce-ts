import { ObjectId } from "mongoose";
import { UserSchemaType } from "../modules/users/user-models";

export interface UserType {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: {
    token: string;
    _id: ObjectId;
  };
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export interface ReqBodyType {
  name: string;
  password: string;
}

export interface CreateUserReturnType {
  user: UserSchemaType;
  token: string;
}
