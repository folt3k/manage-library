import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

import prisma from "../../prisma/client";
import { CurrentUser } from "../auth/auth.models";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import httpErrors from "../common/utils/http-error.util";
import { generateRandomPassword } from "../common/utils/random-password-generator.util";
import { baseUserMapper, userMeMapper } from "./user.mapper";
import { ChangePasswordDto, CreateUserDto, GetMeResponse } from "./user.types";
import { generateHashPassword } from "./user.utils";

export const createUser = async (dto: CreateUserDto): Promise<{ password: string }> => {
  const randomPassword = generateRandomPassword();
  const hashPassword = await generateHashPassword(randomPassword);

  const data = {
    ...dto,
    password: hashPassword,
    role: UserRole.READER,
  };

  await prisma.user.create({ data });

  return {
    password: randomPassword,
  };
};

export const changePassword = async (
  dto: ChangePasswordDto,
  currentUser: CurrentUser
): Promise<User> => {
  const isNewPasswordsEqual = dto.newPassword === dto.repeatedNewPassword;

  if (!isNewPasswordsEqual) {
    throw httpErrors.badRequest("Podane hasła muszą być identyczne.");
  }

  const newHashPassword = await generateHashPassword(dto.newPassword);

  return await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      password: newHashPassword,
    },
  });
};

export const getMe = async (currentUser: CurrentUser): Promise<GetMeResponse> => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: currentUser.id } });

  return {
    user: userMeMapper(user),
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
