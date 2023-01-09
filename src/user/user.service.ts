import { User, UserRole } from "@prisma/client";

import prisma from "../../prisma/client";
import { CurrentUser } from "../auth/auth.models";
import { ListWithPagination, PaginationParams } from "../common/types/pagination";
import httpErrors from "../common/utils/http-error.util";
import { generateRandomString } from "../common/utils/random-string-generator.util";
import { baseUserMapper, userMeMapper } from "./user.mapper";
import { ChangePasswordDto, CreateUserDto, GetMeResponse, UpdateUserDto } from "./user.types";
import { generateHashPassword } from "./user.utils";
import { Option } from "../common/types/option";
import { SortParams } from "../common/types/sort";
import { prepareOrderBy } from "../common/utils/sort.utils";

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
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });

  if (user.role === UserRole.LIBRARIAN || user.email === "zywiolek@gmail.com") {
    throw httpErrors.badRequest("Nie można usunąć tego użytkownika");
  }

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
  if (["janina@gmail.com", "zywiolek@gmail.com"].includes(currentUser.email)) {
    throw httpErrors.badRequest("Nie można zmienić hasła dla tego użytkownika.");
  }

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

export const getUserOptions = async ({ q }: { q?: string }): Promise<Option<string>[]> => {
  if (!q) {
    return [];
  }

  return await prisma.user
    .findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
        AND: [
          {
            disabled: false,
          },
        ],
      },
      take: 10,
    })
    .then((data) =>
      data.map((item) => ({ value: item.id, label: `${item.firstName} ${item.lastName}` }))
    );
};

export const getReaders = async (
  params: PaginationParams & SortParams & { q?: string; onlyActive?: string }
): Promise<ListWithPagination<User>> => {
  const page = params.page;
  const perPage = params.perPage;

  const orderBy = prepareOrderBy(
    params,
    ({ sortBy, sortOrder }) => {
      switch (sortBy) {
        case "name":
          return {
            lastName: sortOrder,
          };
        case "status":
          return {
            disabled: sortOrder,
          };
      }
    },
    [
      {
        disabled: "asc",
      },
      {
        lastName: "asc",
      },
    ]
  );

  const where: object = {
    role: UserRole.READER,
    ...(params.q
      ? {
          OR: [
            {
              firstName: {
                contains: params.q,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: params.q,
                mode: "insensitive",
              },
            },
            {
              email: {
                contains: params.q,
                mode: "insensitive",
              },
            },
            {
              pesel: {
                contains: params.q,
                mode: "insensitive",
              },
            },
          ],
        }
      : null),
    ...(params.onlyActive === "true"
      ? {
          disabled: false,
        }
      : null),
  };

  const users = await prisma.user.findMany({
    where,
    orderBy,
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const total = await prisma.user.count({ where });

  return {
    page,
    perPage,
    total,
    items: users.map((user) => baseUserMapper(user)),
  };
};
