import { UserRole } from "@prisma/client";

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  pesel: number;
  phoneNumber: number;
  role: UserRole;
}
