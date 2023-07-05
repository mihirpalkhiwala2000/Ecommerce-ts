import { Schema, model } from "mongoose";

export interface ProductSchemaType {
  description: string;
  available: boolean;
  owner: Schema.Types.ObjectId;
  _id: Schema.Types.ObjectId;
}

const productSchema = new Schema<ProductSchemaType>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);
export default Product;
