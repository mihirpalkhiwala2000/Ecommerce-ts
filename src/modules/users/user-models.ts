import { Schema, model } from "mongoose";
import validator from "validator";

import { ObjectId } from "mongoose";

export interface UserSchemaType {
  name: string;
  email: string;
  password: string;
  age: number;
  role: number;
  tokens: any;
  _id: ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

const userSchema = new Schema<UserSchemaType>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error("emailError");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value: number) {
        if (value < 0) {
          throw new Error("ageError");
        }
      },
    },
    role: {
      type: Number,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

const User = model("User", userSchema);
export default User;
