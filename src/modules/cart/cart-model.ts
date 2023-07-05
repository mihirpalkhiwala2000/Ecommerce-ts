import { Schema, model } from "mongoose";

interface CartProductType {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

export interface CartSchemaType {
  user: Schema.Types.ObjectId;
  products: Array<CartProductType>;
}

const cartSchema = new Schema<CartSchemaType>(
  {
    user: {
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
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = model("Cart", cartSchema);
export default Cart;
