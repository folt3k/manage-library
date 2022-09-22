import bcrypt from "bcrypt";
import { PASSWORD_HASH_SALT } from "../common/constans";

export const generateHashPassword = async (password: string): Promise<string> => {
  const hashSalt = await bcrypt.genSalt(PASSWORD_HASH_SALT);
  const hashPassword = await bcrypt.hash(password, hashSalt);

  return hashPassword;
};
