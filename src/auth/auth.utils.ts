import jwt from "jsonwebtoken";

export const generateLoginToken = ({ email }: { email: string }): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_TOKEN in envs");
  }

  return jwt.sign({ email }, process.env.JWT_SECRET as jwt.Secret, { expiresIn: "30d" });
};
