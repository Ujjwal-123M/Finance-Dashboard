import { Role, UserStatus } from "@prisma/client";
import type { Request } from "express";

declare global {
  namespace Express {
    interface UserContext {
      id: string;
      email: string;
      role: Role;
      status: UserStatus;
    }

    interface Request {
      user?: UserContext;
      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
