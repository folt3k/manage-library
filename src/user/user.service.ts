import { User, UserRole } from "@prisma/client";

import prisma from "../../prisma/client";
import { CurrentUser } from "../auth/auth.models";
import { ListWithPagination, PaginationParams } from "../common/models/pagination";
import httpErrors from "../common/utils/http-error.util";
import { generateRandomString } from "../common/utils/random-string-generator.util";
import { baseUserMapper, userMeMapper } from "./user.mapper";
import { ChangePasswordDto, CreateUserDto, GetMeResponse, UpdateUserDto } from "./user.types";
import { generateHashPassword } from "./user.utils";

export const createUser = async (dto: CreateUserDto): Promise<{ password: string }> => {
  const randomPassword = generateRandomString();
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

export const updateUser = async (userId: string, dto: UpdateUserDto): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: dto.firstName,
      lastName: dto.lastName,
      pesel: dto.pesel,
      phoneNumber: dto.phoneNumber,
    },
  });

  return undefined;
};

export const removeUser = async (userId: string): Promise<void> => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      disabled: true,
    },
  });

  return undefined;
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

export const getUser = async (userId: string): Promise<Partial<User>> => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });

  return baseUserMapper(user);
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
