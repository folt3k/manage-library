import { User } from "@prisma/client";

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  pesel: number;
  phoneNumber: number;
}

export interface ChangePasswordDto {
  newPassword: string;
  repeatedNewPassword: string;
}

export interface GetMeResponse {
  user: Partial<User>;
}
