import Product, { ProductSchemaType } from "./products-model";
import { ObjectId } from "mongoose";
import { ReqBodyType } from "../../utils/types";
import { QueryType } from "./types";

export const createProduct = async (
  reqBody: ReqBodyType,
  owner: ObjectId
): Promise<ProductSchemaType> => {
  const product = await Product.create({ ...reqBody, owner });

  return product;
};

export const displayProduct = async ({
  limit = "5",
  pageNo = "1",
  sortBy,
  available,
}: QueryType) => {
  let sort: Record<string, number> = {};
  let query: any = {};

  if (available) {
    query = { ...query, available };
  }

  var skip: number = 0;

  if (sortBy) {
    let parts: string[];
    parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  skip = (parseInt(pageNo) - 1) * parseInt(limit);

  const products = await Product.find(query, null, {
    limit: parseInt(limit),
    skip: skip,
    sort: sort,
  }).exec();

  return products;
};

export const displayMyProduct = async (
  { limit = "5", pageNo = "1", sortBy, available }: any,
  userId: QueryType
) => {
  let sort: Record<string, number> = {};
  let query: any = { owner: userId };

  if (available) {
    query = { ...query, available };
  }

  var skip: number = 0;

  if (sortBy) {
    let parts: string[];
    parts = sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  skip = (parseInt(pageNo) - 1) * parseInt(limit);

  const products = await Product.find(query, null, {
    limit: parseInt(limit),
    skip: skip,
    sort: sort,
  }).exec();

  return products;
};

export const deleteProduct = async (id: string, user_Id: string) => {
  const product = await Product.findOneAndDelete({
    _id: id,
    owner: user_Id,
  });

  return product;
};
