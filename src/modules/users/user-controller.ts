import User, { UserSchemaType } from "./user-models";
import generateToken from "../../utils/generateTokensUtils";
import findByCredentials from "../../utils/findByCredentials";
import constants from "../../constant";
import Cart from "../cart/cart-model";
import { CreateUserReturnType, ReqBodyType } from "../../utils/types";
import passwordEncryption from "../../utils/passwordencryption";

const { errorMsgs } = constants;
const { emailLoginError } = errorMsgs;

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
    const createdUser = await User.create(createSuperAdmin);

    const token = await generateToken(createdUser);
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
  UpdateData: ReqBodyType
): Promise<UserSchemaType | null> => {
  let { password } = UpdateData;

  if (password) {
    UpdateData["password"] = await passwordEncryption(password);
  }

  const retuser = User.findOneAndUpdate({ email: user.email }, UpdateData, {
    new: true,
  });

  return retuser;
};

export const logOut = async (userData: UserSchemaType): Promise<void> => {
  await User.findOneAndUpdate({ _id: userData._id }, { tokens: [] });
};
