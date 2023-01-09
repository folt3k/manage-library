import { UserRole } from "@prisma/client";

export interface CurrentUser {
  id: string;
  role: UserRole;
  email: string;
}
