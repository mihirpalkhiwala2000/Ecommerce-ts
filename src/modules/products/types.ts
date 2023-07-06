import { ObjectId } from "mongoose";
import { ReqBodyType } from "../../utils/types";

export interface QueryType {
  available?: string;
  sortBy?: string;
  pageNo?: string;
  limit?: string;
}

export interface DisplayQueryType {
  owner: string;
  completed?: string;
}
