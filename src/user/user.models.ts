import { UserRole } from "@prisma/client";

export interface TokenUserInfo {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface SlimUser {
  id: string;
  firstName: string;
  lastName: string;
}
