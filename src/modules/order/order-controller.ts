import Order, { OrderSchemaType } from "./order-model";
import constant from "../../constant";
import { Error, ObjectId } from "mongoose";
import Cart from "../cart/cart-model";
import { PaymentEnum, StatusEnum } from "./enums";
const { errorMsgs } = constant;
const { emptyCart } = errorMsgs;

export const orderProcessed = async (
  id: ObjectId,
  paymentMode: PaymentEnum
): Promise<OrderSchemaType | void> => {
  const orderItems = await Cart.findOne({
    user: id,
  });

  if (orderItems?.products.length == 0) {
    throw new Error(emptyCart);
  }

  const totalValues = await Cart.aggregate([
    { $match: { user: id } },
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
  if (orderItems) {
    const order: OrderSchemaType = {
      userInfo: orderItems.user,
      products: orderItems.products,
      status: StatusEnum.placed,
      paymentMode,
      totalQuantity: totalValues[0].totalQuantity,
      totalValue: totalValues[0].totalPrice,
    };
    const orderDetails = await Order.create(order);

    await Cart.findOneAndUpdate(
      {
        user: id,
      },
      {
        $set: {
          products: [],
        },
      },
      { new: true }
    );
    return orderDetails;
  }
};

export const displayTotalSales = async () => {
  const totalValues = await Order.aggregate([
    { $unwind: { path: "$products" } },
    {
      $group: {
        _id: "$products.productId",
        totalPrice: {
          $sum: { $multiply: ["$products.price", "$products.quantity"] },
        },
        totalQuantity: { $sum: "$products.quantity" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "admin",
      },
    },
    {
      $unwind: { path: "$admin" },
    },
    {
      $group: {
        _id: "$admin.owner",
        totalSale: {
          $sum: "$totalPrice",
        },
      },
    },
    {
      $addFields: {
        seller: "$_id",
      },
    },
    {
      $unset: ["_id"],
    },
  ]);

  return totalValues;
};
