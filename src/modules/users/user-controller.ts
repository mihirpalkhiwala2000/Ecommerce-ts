import User, { UserSchemaType } from "./user-models";
import * as bcrypt from "bcryptjs";
import generate from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import constants from "../../constant";
import { RoleEnum } from "./enums";
import Cart from "../cart/cart-model";
const { errorMsgs } = constants;
const { emailLoginError } = errorMsgs;

export const createUser = async (userData: Request) => {
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

const superAdmin = async () => {
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

export const loginUser = async (email: string, password: string) => {
  const user: UserSchemaType = await findByCredentials(email, password);
  const token = await generate(user);
  return { user, token };
};

export const deleteUser = async (reqUser_id: string) => {
  await User.findOneAndDelete({
    _id: reqUser_id,
  });
  // await Task.deleteMany({ owner: reqUser_id });
};

export const deleteUserByAdmin = async (email: string) => {
  const user = await User.findOne({ email });
  if (user) {
    const deletedUser = await User.findOneAndDelete({
      email,
    });
  } else {
    throw new Error(emailLoginError);
  }
  // await Task.deleteMany({ owner: reqUser_id });
  return user;
};

export const validateUpdates = async (updates: string[]) => {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
};

export const updateUser = async (user: any, reqBody: any) => {
  let { password } = reqBody;

  if (password) {
    reqBody["password"] = await bcrypt.hash(password, 8);
  }

  await User.findOneAndUpdate({ email: user.email }, reqBody);
  const retuser = User.findOne({ email: user.email });
  return retuser;
};
