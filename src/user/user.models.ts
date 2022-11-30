import { UserRole } from "@prisma/client";

export interface TokenUserInfo {
  id: string;
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
