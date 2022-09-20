import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

import prisma from "../../prisma/client";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import { generateRandomPassword } from "../common/utils/random-password-generator.util";
import { baseUserMapper } from "./user.mapper";
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

export const getReaders = async (params: PaginationParams): Promise<ListWithPagination<User>> => {
  const page = params.page;
  const perPage = params.perPage;

  const users = await prisma.user.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    where: {
      role: UserRole.READER,
    },
  });

  const total = await prisma.user.count({
    where: {
      role: UserRole.READER,
    },
  });

  return {
    page,
    perPage,
    total,
    items: users.map((user) => baseUserMapper(user)),
  };
};
