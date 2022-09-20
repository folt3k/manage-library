import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import prisma from "../../prisma/client";
import { generateRandomPassword } from "../common/utils/random-password-generator.util";
import { CreateUserDto } from "./user.types";

export const createUser = async (dto: CreateUserDto): Promise<{ password: string }> => {
  const hashSalt = await bcrypt.genSalt(10);
  const randomPassword = generateRandomPassword();
  const hashPassword = await bcrypt.hash(randomPassword, hashSalt);

  const data: CreateUserDto = {
    ...dto,
    password: hashPassword,
  };

  await prisma.user.create({ data });

  return {
    password: randomPassword,
  };
};

export const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};
