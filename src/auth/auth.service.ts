import bcrypt from "bcrypt";

import prisma from "../../prisma/client";
import httpErrors from "../common/utils/http-error.util";
import { LoginDto } from "./auth.types";
import { generateLoginToken } from "./auth.utils";

export const login = async (dto: LoginDto): Promise<{ token: string }> => {
  const user = await prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  });

  if (!user) {
    throw httpErrors.badRequest("Użytkownik z takim adresem email nie istnieje.");
  }

  const isPasswordValid = await bcrypt.compare(dto.password, user.password);

  if (!isPasswordValid) {
    throw httpErrors.unauthorized("Podano błędne hasło");
  }

  const token = generateLoginToken(user);

  return { token };
};
