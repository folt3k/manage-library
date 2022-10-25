import * as multer from "multer";
import { Request } from "express";
import path from "path";
import { FileFilterCallback } from "multer";

import { generateRandomString } from "./random-string-generator.util";
import httpErrors from "./http-error.util";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => cb(null, "uploads/"),
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${generateRandomString()}_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  switch (file.mimetype) {
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      cb(null, true);
      break;
    default:
      cb(httpErrors.badRequest("Wczytano niepoprawny format pliku."));
  }
};

const uploadImage = multer.default({ storage, fileFilter });

export default uploadImage;
