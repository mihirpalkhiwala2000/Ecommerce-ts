import Product from "../products/products-model";
import constant from "../../constant";
import Cart, { CartSchemaType } from "./cart-model";
import { UserSchemaType } from "../users/user-models";
import { ObjectId } from "mongoose";
const { errorMsgs } = constant;
const { noProductError, outOfStock } = errorMsgs;

export const addToCart = async (
  _id: string,
  reqUser: UserSchemaType,
  quantity: number
): Promise<CartSchemaType | null> => {
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

export const viewCart = async (userId: ObjectId) => {
  const products = await Cart.findOne({ user: userId });

  return products;
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
