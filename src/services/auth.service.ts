import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ApiError } from "../utils/api-error";
import { signToken } from "../utils/jwt";

interface LoginInput {
  email: string;
  password: string;
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new ApiError(403, "User account is inactive");
  }

  const token = signToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
}
