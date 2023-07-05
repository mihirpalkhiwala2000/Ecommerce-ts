import Cart from "../cart/cart-model";
import Product, { ProductSchemaType } from "./products-model";
import { ObjectId } from "mongoose";
import constant from "../../constant";
const { errorMsgs } = constant;
const { noProductError, outOfStock } = errorMsgs;

export const createProduct = async (reqBody: any, owner: ObjectId) => {
  const product = await Product.create({ ...reqBody, owner });

  return { product };
};

export const displayProduct = async ({
  limit = "5",
  pageNo = "1",
  sortBy,
  available,
}: any) => {
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
  userId: any
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

export const addToCart = async (
  _id: string,
  reqUser: any,
  quantity: number
) => {
  const product = await Product.findOne({ _id });
  if (!product) {
    throw new Error(noProductError);
  }
  if (!product.available) {
    throw new Error(outOfStock);
  }
  const cart = await Cart.findOneAndUpdate(
    { user: reqUser._id },
    {
      $push: { products: { productId: product._id, quantity } },
    },
    { new: true }
  );

  return cart;
};

export const viewCart = async (userId: any) => {
  const products = await Cart.findOne({ user: userId });

  return products;
};

export const deleteProduct = async (id: string, user_Id: string) => {
  const product = await Product.findOneAndDelete({
    _id: id,
    owner: user_Id,
  });

  return product;
};

export const deleteProductFromCart = async (id: string, user_Id: string) => {
  const product = await Cart.findOneAndUpdate(
    { user: user_Id },
    { $pull: { products: { productId: id } } },
    {
      safe: true,
      new: true,
    }
  );

  return product;
};
