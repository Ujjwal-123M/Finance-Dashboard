import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../lib/prisma";
import { UserStatus } from "@prisma/client";

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "Missing or invalid authorization token"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return next(new ApiError(401, "User is inactive or does not exist"));
    }

    req.user = user;
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}
