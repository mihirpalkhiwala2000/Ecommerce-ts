import Product from "../products/products-model";
import constant from "../../constant";
import Cart, { CartSchemaType } from "./cart-model";
import User, { UserSchemaType } from "../users/user-models";
import { ObjectId } from "mongoose";
const { errorMsgs } = constant;
const { noProductError, outOfStock } = errorMsgs;

export const addToCart = async (
  _id: string,
  userData: ObjectId,
  quantity: number
): Promise<CartSchemaType | null> => {
  const product = await Product.findOne({ _id, available: true });
  if (!product) {
    throw new Error(noProductError);
  }

  const updatedProductInCart = await Cart.findOneAndUpdate(
    {
      user: userData,
      "products.productId": product._id,
    },
    {
      $set: {
        "products.$.productId": product._id,
        "products.$.quantity": quantity,
      },
    },
    { new: true }
  );

  if (updatedProductInCart) {
    return updatedProductInCart;
  } else {
    const addedProductToCart = await Cart.findOneAndUpdate(
      { user: userData },
      {
        $push: {
          products: { productId: product._id, quantity, price: product.price },
        },
      },
      { new: true }
    );
    return addedProductToCart;
  }
};

export const viewCart = async (userId: any) => {
  const products = await Cart.findOne({ user: userId });

  const totalValues = await Cart.aggregate([
    { $match: { user: userId } },
    { $unwind: { path: "$products" } },
    {
      $group: {
        _id: "$user",
        totalPrice: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
  ]);

  return { products, totalValues };
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
