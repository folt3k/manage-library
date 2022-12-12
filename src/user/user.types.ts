import { User } from "@prisma/client";

export interface BaseUpsertUserDto {
  firstName: string;
  lastName: string;
  pesel: string;
  phoneNumber: number;
}

export interface CreateUserDto extends BaseUpsertUserDto {
  email: string;
}

export interface UpdateUserDto extends BaseUpsertUserDto {}

export interface ChangePasswordDto {
  newPassword: string;
  repeatedNewPassword: string;
}

export interface GetMeResponse {
  user: Partial<User>;
}
