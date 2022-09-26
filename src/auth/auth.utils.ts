import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const generateLoginToken = ({ email, firstName, lastName, role }: User): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_TOKEN in envs");
  }

  return jwt.sign(
    { user: { email, firstName, lastName, role } },
    process.env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: "30d",
    }
  );
};
