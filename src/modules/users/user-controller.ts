import User, { UserSchemaType } from "./user-models";
import generateToken from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import constants from "../../constant";
import Cart from "../cart/cart-model";
import { CreateUserReturnType, ReqBodyType } from "../../utils/types";
import passwordEncryption from "../../utils/passwordencryption";
import { ObjectId } from "mongoose";

const { errorMsgs } = constants;

export const createUser = async (userData: UserSchemaType): Promise<any> => {
  superAdmin();

  const { password } = userData;
  if (password) {
    userData.password = await passwordEncryption(password);
  }
  const createdUser = await User.create(userData);

  const token = await generateToken(createdUser);
  const products: string[] = [];
  await Cart.create({ user: createdUser._id, products });

  return { createdUser, token };
};

const superAdmin = async (): Promise<void> => {
  const checkSuperAdmin = await User.findOne({ role: 1 });

  if (!checkSuperAdmin) {
    const createSuperAdmin: UserSchemaType = {
      name: process.env.SUPERADMIN_NAME as string,
      email: process.env.SUPERADMIN_EMAIL as string,
      password: process.env.SUPERADMIN_PASSWORD as string,
      role: parseInt(process.env.SUPERADMIN_ROLE as string),
    };

    const password = await passwordEncryption(createSuperAdmin.password);
    createSuperAdmin.password = password;
    await User.create(createSuperAdmin);
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<CreateUserReturnType> => {
  const user: UserSchemaType = await findByCredentials(email, password);
  const token = await generateToken(user);
  return { user, token };
};

export const readProfile = async (
  id: ObjectId
): Promise<UserSchemaType | null> => {
  const profile = await User.findOne({ _id: id });
  return profile;
};

export const deleteUser = async (reqUser_id: string): Promise<undefined> => {
  await User.findOneAndDelete({
    _id: reqUser_id,
  });
  await Cart.deleteOne({ user: reqUser_id });
};

export const deleteUserByAdmin = async (
  email: string
): Promise<UserSchemaType | undefined> => {
  const deletedUser = await User.findOneAndDelete({
    email,
  });

  if (deletedUser) {
    await Cart.findOneAndDelete({ user: deletedUser._id });
    return deletedUser;
  }
};
export const validateUpdates = async (updates: string[]): Promise<Boolean> => {
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update: string) => {
    return allowedUpdates.includes(update);
  });

  return isValidOperation;
};

export const updateUser = async (
  id: UserSchemaType,
  UpdateData: ReqBodyType
): Promise<UserSchemaType | null> => {
  let { password } = UpdateData;

  if (password) {
    UpdateData["password"] = await passwordEncryption(password);
  }

  const retuser = User.findOneAndUpdate({ _id: id }, UpdateData, {
    new: true,
  });

  return retuser;
};

export const logOut = async (userId: ObjectId): Promise<void> => {
  await User.findOneAndUpdate({ _id: userId }, { tokens: [] });
};
