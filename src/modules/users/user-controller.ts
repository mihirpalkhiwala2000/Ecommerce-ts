import User, { UserSchemaType } from "./user-models";
import * as bcrypt from "bcryptjs";
import generate from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import constants from "../../constant";
import Cart from "../cart/cart-model";
import { CreateUserReturnType, ReqBodyType } from "../../utils/types";

const { errorMsgs } = constants;
const { emailLoginError } = errorMsgs;

export const createUser = async (
  userData: Request
): Promise<CreateUserReturnType> => {
  superAdmin();

  const user = new User(userData);
  const { password } = user;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(password, 8);
  }
  await User.create(user);
  const token = await generate(user);
  const products: string[] = [];
  await Cart.create({ user: user._id, products });
  return { user, token };
};

const superAdmin = async (): Promise<undefined> => {
  const superAd = await User.findOne({ role: 1 });

  if (!superAd) {
    const createsuperAd = new User({
      name: process.env.SA_NAME,
      email: process.env.SA_EMAIL,
      password: process.env.SA_PASSWORD,
      role: parseInt(process.env.SA_ROLE as string),
    });

    const password = await bcrypt.hash(createsuperAd.password, 8);
    createsuperAd.password = password;
    await User.create(createsuperAd);

    const token = await generate(createsuperAd);
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<CreateUserReturnType> => {
  const user: UserSchemaType = await findByCredentials(email, password);
  const token = await generate(user);
  return { user, token };
};

export const deleteUser = async (reqUser_id: string): Promise<undefined> => {
  await User.findOneAndDelete({
    _id: reqUser_id,
  });
  await Cart.deleteOne({ user: reqUser_id });
};

export const deleteUserByAdmin = async (
  email: string
): Promise<UserSchemaType> => {
  const user = await User.findOne({ email });
  if (user) {
    const deletedUser = await User.findOneAndDelete({
      email,
    });
    await Cart.deleteOne({ user: user._id });
  } else {
    throw new Error(emailLoginError);
  }

  return user;
};

export const validateUpdates = async (updates: string[]): Promise<Boolean> => {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
};

export const updateUser = async (
  user: UserSchemaType,
  reqBody: ReqBodyType
): Promise<UserSchemaType | null> => {
  let { password } = reqBody;

  if (password) {
    reqBody["password"] = await bcrypt.hash(password, 8);
  }

  const retuser = User.findOneAndUpdate({ email: user.email }, reqBody, {
    new: true,
  });

  return retuser;
};
