import { hash } from "bcryptjs";

export const passwordEncryption = async (password: string): Promise<string> => {
  const ecryptedPassword = await hash(password, 8);
  return ecryptedPassword;
};

export default passwordEncryption;
