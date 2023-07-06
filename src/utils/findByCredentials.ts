import User, { UserSchemaType } from "../modules/users/user-models";
import * as bcrypt from "bcryptjs";
import constant from "../constant";
const { errorMsgs } = constant;
const { passError, emailLoginError } = errorMsgs;

const findByCredentials = async (
  email: string,
  password: string
): Promise<UserSchemaType> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(emailLoginError);
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(passError);
  }
  return user;
};

export default findByCredentials;
