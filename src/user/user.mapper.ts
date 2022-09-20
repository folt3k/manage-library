import { User } from "@prisma/client";
import { omit } from "lodash";

export const baseUserMapper = (user: User): Partial<User> => omit(user, ["password"]);
