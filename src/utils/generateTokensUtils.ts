import * as jwt from "jsonwebtoken";
import User, { UserSchemaType } from "../modules/users/user-models";

async function generateToken(user: UserSchemaType): Promise<string> {
  const token = jwt.sign(
    { _id: user._id?.toString() },
    process.env.JWT_CODE as string
  );

  user.tokens = user.tokens.concat({ token });
  await User.create(user);

  return token;
}

export default generateToken;
