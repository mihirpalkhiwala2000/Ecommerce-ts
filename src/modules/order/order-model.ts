import { Schema, model } from "mongoose";
import { CartProductType } from "../cart/cart-model";
import { PaymentEnum } from "./enums";

export interface OrderSchemaType {
  userInfo: Schema.Types.ObjectId;
  products: Array<CartProductType>;
  status: number;
  paymentMode: PaymentEnum;
  totalValue: number;
  totalQuantity: number;
}

const orderSchema = new Schema<OrderSchemaType>(
  {
    userInfo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    status: {
      type: Number,
    },
    paymentMode: { type: Number, required: true },
    totalQuantity: { type: Number, required: true },
    totalValue: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);
export default Order;
