import HttpException from "../models/http";

const httpErrors: { [key: string]: (message?: string) => HttpException } = {
  badRequest: (mesage?: string) => new HttpException(400, mesage),
  unauthorized: (mesage?: string) => new HttpException(401, mesage),
  forbidden: (mesage?: string) => new HttpException(403, mesage),
};

export default httpErrors;
