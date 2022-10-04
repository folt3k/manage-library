import { User } from "@prisma/client";
import { omit } from "lodash";

export const baseUserMapper = (user: User): Partial<User> => omit(user, ["password"]);

export const userMeMapper = (user: User): Partial<User> =>
  omit(baseUserMapper(user), ["isActive", "updatedAt", "id"]);
