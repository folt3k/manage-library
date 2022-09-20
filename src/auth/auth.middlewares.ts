import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import httpErrors from "../common/utils/http-error.util";
import prisma from "../../prisma/client";

export const auth =
  (options: { roles?: UserRole[] } = {}) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(" ")?.[1];

    if (!token) {
      return next(httpErrors.unauthorized());
    }

    if (!process.env.JWT_SECRET) {
      return next(new Error("Missing JWT_TOKEN in envs"));
    }

    try {
      const verfifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!verfifiedToken) {
        next(httpErrors.unauthorized("Podany token nie jest poprawny"));
      }

      const user = await prisma.user.findUnique({
        where: { email: (verfifiedToken as { email: string }).email },
        select: {
          id: true,
          role: true,
        },
      });

      if (user) {
        req.user = {
          id: user.id,
        };

        if (options.roles?.length && !options.roles.includes(user.role)) {
          next(httpErrors.forbidden());
        }

        next();
      } else {
        next(httpErrors.unauthorized("Nie znaleziono takiego użytkownika"));
      }
    } catch (err) {
      next(httpErrors.unauthorized((err as { message: string }).message));
    }
  };
