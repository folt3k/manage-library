import HttpException from "../types/http";

const httpErrors = {
  badRequest: (mesage?: string) => new HttpException(400, mesage),
  unauthorized: (mesage?: string) => new HttpException(401, mesage),
  forbidden: (mesage?: string) => new HttpException(403, mesage),
  notFound: (mesage?: string) => new HttpException(404, mesage),
};

export default httpErrors;
