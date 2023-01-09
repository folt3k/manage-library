declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: "LIBRARIAN" | "READER";
      email: string;
    };
  }
}
