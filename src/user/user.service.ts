import { User } from "@prisma/client";

import prisma from "../../prisma/client";
import { CreateUserDto } from "./user.types";

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  const data: CreateUserDto = {
    ...dto,
    // TODO: Should generate password
    password: "haslo123",
  };

  return await prisma.user.create({ data });
};

export const getUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};
