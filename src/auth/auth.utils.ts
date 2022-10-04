import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { TokenUserInfo } from "../user/user.models";

export const generateLoginToken = ({ email, firstName, lastName, role }: User): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_TOKEN in envs");
  }

  const user: TokenUserInfo = { email, firstName, lastName, role };

  return jwt.sign({ user }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: "30d",
  });
};
